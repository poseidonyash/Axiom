// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AxiomV2
 * @dev Upgraded Axiom contract with prediction history for Oracle Feed
 * @notice This contract stores predictions AND maintains a public feed
 */
contract AxiomV2 {
    // Token name and symbol
    string public constant name = "Axiom Predictions V2";
    string public constant symbol = "AXIOM2";
    
    // Prediction struct for the Oracle Feed
    struct Prediction {
        string market;          // e.g., "Bitcoin > $100k"
        string betSize;         // e.g., "$1,234.56"
        address predictor;      // Who made the prediction
        uint256 timestamp;      // When it was made
        uint256 edge;           // Edge percentage (stored as basis points, e.g., 1250 = 12.50%)
    }
    
    // Token counter
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    
    // Mapping from owner to number of owned tokens
    mapping(address => uint256) private _balances;
    
    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;
    
    // PUBLIC FEED: Array of all predictions (for Oracle Feed)
    Prediction[] public predictions;
    
    // Max predictions to store (to prevent unbounded growth)
    uint256 public constant MAX_PREDICTIONS = 100;
    
    // Events
    event PredictionMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string market,
        string betSize,
        uint256 edge,
        uint256 timestamp
    );
    
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    
    /**
     * @dev Mints a new prediction NFT and adds to public feed
     * @param tokenURI The metadata URI for this prediction
     * @param market The market name (e.g., "Bitcoin > $100k")
     * @param betSize The bet size as a string (e.g., "$1,234.56")
     * @param edgeBasisPoints The edge in basis points (1250 = 12.50%)
     * @return The token ID of the newly minted NFT
     */
    function mintPrediction(
        string memory tokenURI,
        string memory market,
        string memory betSize,
        uint256 edgeBasisPoints
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Mint the NFT
        _owners[tokenId] = msg.sender;
        _balances[msg.sender]++;
        _tokenURIs[tokenId] = tokenURI;
        
        // Add to public predictions feed
        // If we've hit max, remove oldest (FIFO)
        if (predictions.length >= MAX_PREDICTIONS) {
            // Shift array left (remove first element)
            for (uint256 i = 0; i < predictions.length - 1; i++) {
                predictions[i] = predictions[i + 1];
            }
            predictions.pop();
        }
        
        // Add new prediction
        predictions.push(Prediction({
            market: market,
            betSize: betSize,
            predictor: msg.sender,
            timestamp: block.timestamp,
            edge: edgeBasisPoints
        }));
        
        emit PredictionMinted(
            msg.sender,
            tokenId,
            market,
            betSize,
            edgeBasisPoints,
            block.timestamp
        );
        emit Transfer(address(0), msg.sender, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Get the most recent predictions for the Oracle Feed
     * @param count Number of predictions to return (max 20)
     * @return Array of recent predictions
     */
    function getRecentPredictions(uint256 count) public view returns (Prediction[] memory) {
        // Cap at 20 for gas efficiency
        if (count > 20) count = 20;
        if (count > predictions.length) count = predictions.length;
        
        Prediction[] memory recent = new Prediction[](count);
        
        // Return most recent first (reverse order)
        for (uint256 i = 0; i < count; i++) {
            recent[i] = predictions[predictions.length - 1 - i];
        }
        
        return recent;
    }
    
    /**
     * @dev Get total number of predictions in the feed
     * @return The count
     */
    function getPredictionCount() public view returns (uint256) {
        return predictions.length;
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




