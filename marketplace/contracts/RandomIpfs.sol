// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfs_notEnoughEthSent();
error RandomIpfs_rangeOutOfBounds();
error RandomIpfs_moneyTransferFailed();

contract RandomIpfs is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    event nftRequested(address indexed sender, uint256 indexed requestId);
    event nftMinted(Breed dogBreed, address minter);

    enum Breed {
        PUG,
        SHIBA,
        BRENARD
    }

    mapping(uint256 => address) RequestToAddress;
    uint256 tokenId;
    string[3] internal i_dogUris;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_keyHash;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    //constants
    uint16 private constant requestConfirmations = 3;
    uint32 private constant numWords = 2;
    uint256 internal immutable fee = 10000000000000000;

    //sets up all of the values we will need when we request a random number
    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        string[3] memory dogUris
    ) VRFConsumerBaseV2(vrfCoordinator) ERC721("randomNFT", "R") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_dogUris = dogUris;
        tokenId = 0;
    }

    function requestNft() public payable returns (uint256) {
        if (msg.value < fee) {
            revert RandomIpfs_notEnoughEthSent();
        }
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            requestConfirmations,
            i_callbackGasLimit,
            numWords
        );
        RequestToAddress[requestId] = msg.sender;
        emit nftRequested(msg.sender, requestId);
        return requestId;
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [uint256(10), 30, 100];
    }

    function getPupType(uint256 moddedNum) public pure returns (Breed) {
        //f do computagtion to return breed
        uint256 sum = 0;
        uint256[3] memory chanceArray = getChanceArray();

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (moddedNum >= sum && moddedNum < sum + chanceArray[i]) {
                return Breed(i);
            }
            sum += chanceArray[i];
        }
        revert RandomIpfs_rangeOutOfBounds();
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        address dogOwner = RequestToAddress[requestId];
        uint256 randomWord = randomWords[0];
        uint256 moddenNum = randomWord % 100;
        Breed yourDog = getPupType(moddenNum);

        _safeMint(dogOwner, tokenId);
        _setTokenURI(tokenId, i_dogUris[uint256(yourDog)]);
        tokenId++;
        emit nftMinted(yourDog, dogOwner);
    }

    function withdraw() public onlyOwner {
        uint256 money = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: money}("");
        if (!success) {
            revert RandomIpfs_moneyTransferFailed();
        }
    }

    function getVftCoordinator()
        public
        view
        returns (VRFCoordinatorV2Interface)
    {
        return i_vrfCoordinator;
    }

    function getSubscriptionId() public view returns (uint256) {
        return i_subscriptionId;
    }

    function getFee() public pure returns (uint256) {
        return fee;
    }

    function getTokenId() public view returns (uint256) {
        return tokenId;
    }
}
