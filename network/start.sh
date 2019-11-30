#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

function replacePrivateKey() {
    echo "ca key file exchange"
    cp docker-compose-template.yml docker-compose.yml
    PRIV_KEY=$(ls crypto-config/peerOrganizations/org1.trucker.com/ca/ | grep _sk)
    sed -i "s/CA_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yml
}

function checkPrereqs() {
    # check config dir
    if [ ! -d "crypto-config" ]; then
        echo "crypto-config dir missing"
        exit 1
    fi
    # check crypto-config dir
     if [ ! -d "config" ]; then
        echo "config dir missing"
        exit 1
    fi
}

checkPrereqs
replacePrivateKey

docker-compose -f docker-compose.yml down

replacePrivateKey

docker-compose -f docker-compose.yml up -d 
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# 채널 생성
docker exec cli peer channel create -o orderer.trucker.com:7050 -c trucker -f /etc/hyperledger/configtx/channel.tx

# peer0.org1.trucker.com 채널 참여
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.trucker.com/msp" peer0.org1.trucker.com peer channel join -b /etc/hyperledger/configtx/trucker.block
sleep 5

# peer0.org2.trucker.com 채널 참여
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.trucker.com/msp" peer0.org2.trucker.com peer channel join -b /etc/hyperledger/configtx/trucker.block
sleep 5

# peer0.org3.trucker.com 채널 참여
docker exec -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.trucker.com/msp" peer0.org3.trucker.com peer channel join -b /etc/hyperledger/configtx/trucker.block
sleep 5

docker exec cli peer chaincode install -n cargo -v 1.0 -p github.com/trcc/
docker exec cli peer chaincode instantiate -v 1.0 -C trucker -n cargo -c '{"Args":["Init"]}' -P 'OR ("Org1MSP.member", "Org2MSP.member")'
