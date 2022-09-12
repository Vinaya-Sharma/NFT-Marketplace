// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract nftMarketplace is ReentrancyGuard {
    //type
    struct Listing {
        uint256 price;
        address seller;
    }

    //error codes
    error nftMarketplace__nftPriceBelowZero();
    error nftMarketplace__nftNotApproved();
    error nftMarketplace__alreadyListed();
    error nftMarketplace__notNftOwner();
    error nftMarketplace__notListed(address nftAddress, uint256 token);
    error nftMarketplace__priceNotMet(
        address nftAddress,
        uint256 token,
        uint256 price
    );
    error nftMarketplace__noProceeds();
    error nftMarketplace__unableToTransferFunds();

    //events
    event ItemListed(
        address indexed sender,
        address indexed nftAddress,
        uint256 indexed token,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed token,
        uint256 price
    );

    event ItemCancelled(
        address indexed nftAddress,
        uint256 indexed token,
        address indexed seller
    );

    //mappings
    // nft address => nft token id => listing includes price + sender
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // user address => funds earned
    mapping(address => uint256) private s_proceeds;

    //////////////////
    /// Modifiers ///
    /////////////////

    modifier notListed(
        address nftAddress,
        uint256 token,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][token];

        if (listing.price > 0) {
            revert nftMarketplace__alreadyListed();
        }

        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 token,
        address sender
    ) {
        IERC721 nft = IERC721(nftAddress);

        if (nft.ownerOf(token) != sender) {
            revert nftMarketplace__notNftOwner();
        }

        _;
    }

    modifier isListed(address nftAddress, uint256 token) {
        Listing memory theNft = s_listings[nftAddress][token];
        if (theNft.price <= 0) {
            revert nftMarketplace__notListed(nftAddress, token);
        }
        _;
    }

    //////////////////
    /// Main Func. ///
    /////////////////

    /**
     * @notice method to list your own nft on marketplace
     * @param nftAddress: address of nft
     * @param token: unique token id
     * @param price: list price for nft
     * @dev could have fully send this nft to contract
     * but this way users can still hold ownership
     */
    function listItem(
        address nftAddress,
        uint256 token,
        uint256 price
    )
        external
        notListed(nftAddress, token, msg.sender)
        isOwner(nftAddress, token, msg.sender)
    {
        if (price < 0) {
            revert nftMarketplace__nftPriceBelowZero();
        }

        // check if approved to sell nft
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(token) != address(this)) {
            revert nftMarketplace__nftNotApproved();
        }

        s_listings[nftAddress][token] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, token, price);
    }

    function buyItem(address nftAddress, uint256 token)
        external
        payable
        isListed(nftAddress, token)
        nonReentrant
    {
        Listing memory listedItem = s_listings[nftAddress][token];

        if (listedItem.price > msg.value) {
            revert nftMarketplace__priceNotMet(
                nftAddress,
                token,
                listedItem.price
            );
        }

        s_proceeds[listedItem.seller] =
            s_proceeds[listedItem.seller] +
            msg.value;
        delete (s_listings[nftAddress][token]);
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            token
        );

        emit ItemBought(msg.sender, nftAddress, token, listedItem.price);
    }

    function cancelListing(address nftAddress, uint256 token)
        external
        isOwner(nftAddress, token, msg.sender)
        isListed(nftAddress, token)
    {
        delete (s_listings[nftAddress][token]);
        emit ItemCancelled(nftAddress, token, msg.sender);
    }

    function updateListing(
        address nftAddress,
        uint256 token,
        uint256 newPrice
    )
        external
        isOwner(nftAddress, token, msg.sender)
        isListed(nftAddress, token)
    {
        if (newPrice <= 0) {
            revert nftMarketplace__nftPriceBelowZero();
        }

        s_listings[nftAddress][token].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, token, newPrice);
    }

    function withdrawProceeds() external payable {
        uint256 payment = s_proceeds[msg.sender];

        if (payment <= 0) {
            revert nftMarketplace__noProceeds();
        }

        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: payment}("");

        if (!success) {
            revert nftMarketplace__unableToTransferFunds();
        }
    }

    //////////////////////
    /// Getter Funcs. ///
    /////////////////////

    function getListing(address nftAddress, uint256 token)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][token];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
