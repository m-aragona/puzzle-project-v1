//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PartsCollection is ERC721, Ownable {
    string public _baseURIextended; // private
    string public _baseURInotRevealed; // private
    uint256 public constant MAX_SUPPLY = 25;
    uint256 public constant MAX_PUBLIC_MINT = 10;
    uint256 public constant PRICE_PER_TOKEN = 0.0001 ether;
    uint256 public tokenId;

    bool public revealed = false; // Not in use
    bool public whitelistIsActive = false; // Not in use
    bool public saleIsActive = false; // Not in use

    mapping(address => uint8) public _whiteList;
    mapping(address => uint8) public m_add;

    event partsMinted(address indexed from, uint256 quantity);

    constructor() ERC721("Puzzle", "PZL") {
        tokenId = 1;
    }

    function setWhitelist(address[] calldata addresses, uint8 numAllowedMint)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            _whiteList[addresses[i]] = numAllowedMint;
        }
    }

    function mintWhitelist(uint8 numberOfTokens) external payable {
        require(whitelistIsActive, "Whitelist is not active");
        require(
            numberOfTokens <= _whiteList[msg.sender],
            "Exceeded max available to purchase"
        );
        require(
            tokenId + numberOfTokens - 1 <= MAX_SUPPLY,
            "Purchase will exceed max supply"
        );
        require(
            PRICE_PER_TOKEN * numberOfTokens <= msg.value,
            "Ether value is not correct"
        );

        _whiteList[msg.sender] -= numberOfTokens;
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, tokenId + i);
        }
        tokenId = tokenId + numberOfTokens;
    }

    function mint(uint256 numberOfTokens) public payable {
        require(saleIsActive, "Sale is not active yet");
        require(
            numberOfTokens <= MAX_PUBLIC_MINT,
            "Exceeded max available to purchase"
        );
        require(
            tokenId + numberOfTokens - 1 <= MAX_SUPPLY,
            "Purchase will exceed max supply"
        );
        require(
            PRICE_PER_TOKEN * numberOfTokens <= msg.value,
            "Ether sent value is not correct"
        );

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, tokenId + i);
        }
        tokenId = tokenId + numberOfTokens;

        emit partsMinted(msg.sender, numberOfTokens);

        if (tokenId == 26) {
            sendFullNFT();
        }
    }

    function sendFullNFT() public {
        require(tokenId == 26, "Can't send");
        uint256 id = 1;
        for (uint256 i = 1; i < 26; i++) {
            if (m_add[ownerOf(i)] < 1) {
                _safeMint(ownerOf(i), 25 + id);
                m_add[ownerOf(i)] = 1;
                id++;
                tokenId++;
            }
        }
    }

    function claimFullArt() public {
        address add;
        add = ownerOf(1);
        for (uint256 i = 2; i < 26; i++) {
            if (ownerOf(i) != add) {
                return;
            }
        }
        for (uint256 i = 1; i < 26; i++) {
            _burn(i);
        }
        _safeMint(add, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (revealed == true) {
            return super.tokenURI(_tokenId);
        } else {
            return _baseURInotRevealed;
        }
    }

    function revealCollection() public onlyOwner {
        revealed = true;
    }

    function setBaseUriExtended(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function setBaseUriNotRevealed(string memory baseURInotRevealed_)
        external
        onlyOwner
    {
        _baseURInotRevealed = baseURInotRevealed_;
    }

    function setWhitelistActive() external onlyOwner {
        whitelistIsActive = true;
    }

    function setSaleIsActive() public onlyOwner {
        saleIsActive = true;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
