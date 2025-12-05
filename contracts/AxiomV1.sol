// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AxiomV1
 * @dev Simple ERC-721 contract for minting "Proof of Intelligence" prediction NFTs
 * @notice This contract stores prediction metadata as tokenURIs for the Axiom hackathon
 */
contract AxiomV1 {
    // Token name and symbol
    string public constant name = "Axiom Predictions";
    string public constant symbol = "AXIOM";
    
    // Token counter
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    
    // Mapping from owner to number of owned tokens
    mapping(address => uint256) private _balances;
    
    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Events
    event PredictionMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 timestamp
    );
    
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    
    /**
     * @dev Mints a new prediction NFT
     * @param _tokenURI The metadata URI for this prediction
     * @return The token ID of the newly minted NFT
     */
    function mintPrediction(string memory _tokenURI) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _owners[tokenId] = msg.sender;
        _balances[msg.sender]++;
        _tokenURIs[tokenId] = _tokenURI;
        
        emit PredictionMinted(msg.sender, tokenId, _tokenURI, block.timestamp);
        emit Transfer(address(0), msg.sender, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Returns the owner of a token
     * @param tokenId The token ID to query
     * @return The owner address
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }
    
    /**
     * @dev Returns the number of tokens owned by an address
     * @param owner The address to query
     * @return The balance
     */
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Invalid address");
        return _balances[owner];
    }
    
    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The token ID to query
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }
    
    /**
     * @dev Returns the total number of tokens minted
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}



