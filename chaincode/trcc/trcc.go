package main

import (
	"encoding/json"
	"fmt"
	// "bytes"
	"time"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)


type ChainCode struct {
}

// // 키 구조체
// type User struct {
// 	Phone   string `json:"phone"`
// 	Truck Truck `json:"truck"`
// }

// 키 구조체
type Truck struct {
	ObjectType	string `json:"docType"`
	Key string `json:"key"` // 키
	StartPoint string `json:"startpoint"` // 출발지
	EndPoint string `json:"endpoint"` // 도착지 
	CarWeight string `json:"carweight"`  // 차 톤
	Weight string `json:"weight"`   // 적재 중량
	TransPort string `json:"transport"` // 운행방법 1:편도 2:왕복
	Cost string `json:"cost"` // 금액 
	Distance string `json:"distance"` //거리
	Date string `json:"date"` // 완료 시간
}
type GeoAvg struct {
	Geo string `json:"geo"`
	Average int64 `json:"average"`   
	Cost []Cost `json:"cost"`
 }
 
 type Cost struct {
	Money int64 `json:"money"`
	Road int64 `json:"road"` //거리

 }

func (s *ChainCode) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}



func (s *ChainCode) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()

	// if function == "addUser" {
	// 	return s.addUser(APIstub, args)
	// } 
	if function == "addTruck" {
		return s.addTruck(APIstub, args)
	} else if function == "getTruck" {
		return s.getTruck(APIstub, args)
	} else if function == "getAllTruck" {
		return s.getAllTruck(APIstub)
	} else if function == "getHistory" {
		return s.getHistory(APIstub, args)
	} else if function == "getTruckByValue" {
		return s.getTruckByValue(APIstub, args)
	} else if function == "addAverage" {
		return s.addAverage(APIstub, args)
	 } else if function == "getAverage" {
		return s.getAverage(APIstub,args)
	 } else if function =="addGeo" {
		return s.addGeo(APIstub,args)
	 } else if function == "addAverage_dis" {
		 return s.addAverage_dis(APIstub, args)
	 }

	return shim.Error("Invalid Smart Contract function name.")
}

// 유저 등록
// func (s *ChainCode) addUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

// 	if len(args) != 1 {
// 		return shim.Error("fail!")
// 	}
// 	var user = User{Phone: args[0]}
// 	userAsBytes, _ := json.Marshal(user)
// 	APIstub.PutState(args[0], userAsBytes)

// 	return shim.Success(nil)
// }

// 데이터 입력
func (s *ChainCode) addTruck(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var data = Truck{ObjectType: "Truck", Key:args[0], StartPoint:args[1], EndPoint:args[2], CarWeight:args[3], Weight:args[4], TransPort:args[5], Cost:args[6] ,Distance:args[7], Date:time.Now().Format("20060102150405") }
	userAsBytes,_:=json.Marshal(data)

	// 월드스테이드 업데이트 
	geo_cut := strings.Fields(args[1])

	// s.addAverage(APIstub, []string{geo_cut[0], args[6]})
   	s.addAverage_dis(APIstub, []string{geo_cut[0], args[6],args[7]})
	   
	APIstub.PutState(args[0], userAsBytes)

	indexName := "startpoint~id"
	startpointidIndexKey, err := APIstub.CreateCompositeKey(indexName, []string{data.StartPoint, data.Key})
	if err != nil {
		return shim.Error(err.Error())
	}
	//  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the marble.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	value := []byte{0x00}
	APIstub.PutState(startpointidIndexKey, value)
	return shim.Success([]byte("rating is updated"))

}

// 키값 데이터 조회
func (s *ChainCode) getTruck(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	value, err := APIstub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Battery")
	}
	if value == nil {
		return shim.Error("value not found")
	}
	return shim.Success(value)
}

// 모든 데이터 조회
func (s *ChainCode) getAllTruck(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "00000000000"
	endKey := "999999999999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	var buffer string
	buffer ="["

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer += ","
		}

		buffer += string(response.Value)

		bArrayMemberAlreadyWritten = true
	}
	buffer += "]"
	return shim.Success([]byte(buffer))
}

// 키 이력 조회
func (s *ChainCode) getHistory(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	truckName := args[0]

	fmt.Printf("- start getHistoryForBattery: %s\n", truckName)

	resultsIterator, err := stub.GetHistoryForKey(truckName)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()


	var buffer string
	buffer ="["

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		if bArrayMemberAlreadyWritten == true {
			buffer += ","
		}

			buffer += string(response.Value)

		bArrayMemberAlreadyWritten = true
	}
	buffer += "]"

	return shim.Success([]byte(buffer))
}
//밸류 조회
func (s *ChainCode) getTruckByValue(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	value := args[0]
	queriedIdByValueIterator, err := APIstub.GetStateByPartialCompositeKey("startpoint~id", []string{value})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer queriedIdByValueIterator.Close()


	var buffer string
	buffer = "["
	bArrayMemberAlreadyWritten := false
	
	var i int

	for i = 0; queriedIdByValueIterator.HasNext(); i++ {
		response, err := queriedIdByValueIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		objectType, compositeKeyParts, err := APIstub.SplitCompositeKey(response.Key)
		if err != nil {
			return shim.Error(err.Error())
		}

		returnedName := compositeKeyParts[0]
		returnedKey := compositeKeyParts[1]

		fmt.Printf("- found a key from index:%s name:%s key:%s\n", objectType, returnedName, returnedKey)
		if bArrayMemberAlreadyWritten == true {
			buffer += ", "
		}

		truckAsBytes, err := APIstub.GetState(returnedKey)
		if err != nil {
			return shim.Error(err.Error())
		}

		buffer += string(truckAsBytes)
		bArrayMemberAlreadyWritten = true
	}

	buffer += "]"

	return shim.Success([]byte(buffer))
}

// 지역(키) 추가

func (s *ChainCode) addGeo(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
	   return shim.Error("fail!")
	}
	var geo = GeoAvg{Geo: args[0], Average: 0}
	avgAsBytes, _ := json.Marshal(geo)
	APIstub.PutState(args[0], avgAsBytes)
 
	return shim.Success(nil)
 }
 
 
 //평균금액 추가 
 
 func (s *ChainCode) addAverage(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
	   return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	// 지역 확인
	avgAsBytes, err := APIstub.GetState(args[0])
	if err != nil{
	   jsonResp := "\"Error\":\"Failed to get state for "+ args[0]+"\"}"
	   return shim.Error(jsonResp)
	} else if avgAsBytes == nil{
	   
	   s.addGeo(APIstub, []string{args[0]})
	   
	   Avg := GeoAvg{}
 
	   // 이전 데이터 저장
	   err = json.Unmarshal(avgAsBytes, &Avg)
	   
	   // 새로운 데이터 저장
	   Avg.Geo=args[0]
	   newCost,_ := strconv.ParseInt(args[1],0,64)
	   costCount := int64(len(Avg.Cost))
	   var cost = Cost{Money:newCost}
	   Avg.Cost=append(Avg.Cost,cost)
	   Avg.Average = (costCount*Avg.Average+newCost)/(costCount+1)
	
	   
	   avgAsBytes, err = json.Marshal(Avg);
	
	   APIstub.PutState(args[0], avgAsBytes)
	
	   return shim.Success([]byte("avg is updated"))
	}
 
	// 평균금액 구조체 선언
	Avg := GeoAvg{}
 
	// 이전 데이터 저장
	err = json.Unmarshal(avgAsBytes, &Avg)
	
	// 새로운 데이터 저장
	Avg.Geo=args[0]
	newCost,_ := strconv.ParseInt(args[1],0,64)
	costCount := int64(len(Avg.Cost))
	var cost = Cost{Money:newCost}
	Avg.Cost=append(Avg.Cost,cost)
	Avg.Average = (costCount*Avg.Average+newCost)/(costCount+1)
 
	
	avgAsBytes, err = json.Marshal(Avg);
 
	APIstub.PutState(args[0], avgAsBytes)
 
	return shim.Success([]byte("avg is updated"))
 
 }

 func (s *ChainCode) addAverage_dis(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
	   return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	// 지역 확인
	avgAsBytes, err := APIstub.GetState(args[0])
	if err != nil{
	   jsonResp := "\"Error\":\"Failed to get state for "+ args[0]+"\"}"
	   return shim.Error(jsonResp)
	} else if avgAsBytes == nil{
	   
	   s.addGeo(APIstub, []string{args[0]})
	   
	   Avg := GeoAvg{}
 
	   // 이전 데이터 저장
	   err = json.Unmarshal(avgAsBytes, &Avg)
	   
	   // 새로운 데이터 저장
	   Avg.Geo=args[0]
	   newCost,_ := strconv.ParseInt(args[1],0,64)
	   newDis,_:= strconv.ParseInt(args[2],0,64)
	   costCount := int64(len(Avg.Cost))
	   var cost = Cost{Money:newCost, Road: newDis}
	   Avg.Cost=append(Avg.Cost,cost)
	   Avg.Average = (costCount*Avg.Average+(newCost/newDis))/(costCount+1)
	
	   
	   avgAsBytes, err = json.Marshal(Avg);
	
	   APIstub.PutState(args[0], avgAsBytes)
	
	   return shim.Success([]byte("avg is updated"))
	}
 
	// 평균금액 구조체 선언
	Avg := GeoAvg{}
 
	// 이전 데이터 저장
	err = json.Unmarshal(avgAsBytes, &Avg)
	
	// 새로운 데이터 저장
	Avg.Geo=args[0]
	newCost,_ := strconv.ParseInt(args[1],0,64)
	newDis,_:= strconv.ParseInt(args[2],0,64)
	costCount := int64(len(Avg.Cost))
	var cost = Cost{Money:newCost, Road: newDis}
	Avg.Cost=append(Avg.Cost,cost)
	Avg.Average = (costCount*Avg.Average+(newCost/newDis))/(costCount+1)
 
	
	avgAsBytes, err = json.Marshal(Avg);
 
	APIstub.PutState(args[0], avgAsBytes)
 
	return shim.Success([]byte("avg is updated"))
 
 }
 
 
 //평균금액 조회
 
 func (s *ChainCode) getAverage(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
	   return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	AvgAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(AvgAsBytes)
 }

func main() {
	if err := shim.Start(new(ChainCode)); err != nil {
		fmt.Printf("Error starting ChainCode chaincode: %s", err)
	}
}