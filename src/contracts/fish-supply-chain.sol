pragma solidity =0.6.0;

contract Registration {
    address FDA;
    mapping(address => bool) FishSeedCompany;
    mapping(address => bool) FishFarmer;
    mapping(address => bool) WildCaughtFisher;
    mapping(address => bool) FishProcessor;
    mapping(address => bool) Distributor;
    mapping(address => bool) Retailer;
    mapping(address => bool) Consumer;

    modifier onlyFDA() {
        require(msg.sender == FDA, "Sender not authorized.");
        _;
    }

    constructor() public {
        FDA = msg.sender;
    }

    function RegisterFishSeedCompany(address s) public onlyFDA {
        require(!FishSeedCompany[s], "FishSeedCompany exists already");

        FishSeedCompany[s] = true;
    }

    function RegisterFishFarmer(address f) public onlyFDA {
        require(!FishFarmer[f], "FishFarmer exists already");

        FishFarmer[f] = true;
    }

    function RegisterFishProcessor(address p) public onlyFDA {
        require(!FishProcessor[p], "FishProcessor exists already");

        FishProcessor[p] = true;
    }

    function RegisterDistributor(address d) public onlyFDA {
        require(!Distributor[d], "Distributor exists already");

        Distributor[d] = true;
    }

    function RegisterRetailer(address r) public onlyFDA {
        require(!Retailer[r], "Retailer exists already");

        Retailer[r] = true;
    }

    function RegisterConsumer(address c) public onlyFDA {
        require(!Consumer[c], "Consumer exists already");

        Consumer[c] = true;
    }

    function RegisterWildCaughtFisher(address w) public onlyFDA {
        require(!WildCaughtFisher[w], "WildCaughtFisher exists already");

        WildCaughtFisher[w] = true;
    }

    function isFDA(address f) public view returns (bool) {
        return (FDA == f);
    }

    function FishSeedCompanyExists(address s) public view returns (bool) {
        return FishSeedCompany[s];
    }

    function FishFarmerExists(address f) public view returns (bool) {
        return FishFarmer[f];
    }

    function FishProcessorExists(address p) public view returns (bool) {
        return FishProcessor[p];
    }

    function DistributorExists(address d) public view returns (bool) {
        return Distributor[d];
    }

    function RetailerExists(address r) public view returns (bool) {
        return Retailer[r];
    }

    function ConsumerExists(address c) public view returns (bool) {
        return Consumer[c];
    }

    function WildCaughtFisherExists(address w) public view returns (bool) {
        return WildCaughtFisher[w];
    }

    function GetRole(address r) public view returns (string memory) {
        if (isFDA(r)) return "FDA";
        if (FishSeedCompanyExists(r)) return "Fish Seed Company";
        if (FishFarmerExists(r)) return "Fish Farmer";
        if (FishProcessorExists(r)) return "Fish Processor";
        if (DistributorExists(r)) return "Distributor";
        if (RetailerExists(r)) return "Retailer";
        if (ConsumerExists(r)) return "Consumer";
        if (WildCaughtFisherExists(r)) return "Wild Caught Fisher";

        return "Unknown";
    }

    function UpdateUserStatus(
        address u,
        string memory role,
        bool active
    ) public onlyFDA {
        require(isFDA(msg.sender), "Sender not authorized");

        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Fish Seed Company"))
        ) {
            FishSeedCompany[u] = active;
        }
        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Fish Farmer"))
        ) {
            FishFarmer[u] = active;
        }
        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Fish Processor"))
        ) {
            FishProcessor[u] = active;
        }
        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Distributor"))
        ) {
            Distributor[u] = active;
        }
        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Retailer"))
        ) {
            Retailer[u] = active;
        }
        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Consumer"))
        ) {
            Consumer[u] = active;
        }
        if (
            keccak256(abi.encodePacked(role)) ==
            keccak256(abi.encodePacked("Wild Caught Fisher"))
        ) {
            WildCaughtFisher[u] = active;
        }
    }
}

contract FarmedFish {
    string public SpeciesName;
    string public GeographicOrigin;
    string public methodOfReproduction;
    uint256 public NumberOfFishSeedsAvailable;
    uint256 public waterTemperature;
    string public images;
    string IPFS_Hash;
    address registrationContract;
    address public FishSeedCompany;

    Registration RegistrationContract;

    event FishSeedsDescriptionsSet(
        string SpeciesName,
        string GeographicOrigin,
        string methodOfReproduction,
        uint256 NumberOfFishSeedsAvailable,
        uint256 waterTemperature,
        string images,
        string IPFS_Hash
    );

    constructor(
        address registration,
        string memory Speciesname,
        string memory Geographicorigin,
        uint256 NumberOfFishSeedsavailable,
        string memory IPFShash,
        string memory MethodOfReproduction,
        string memory Images,
        uint256 WaterTemperature
    ) public {
        RegistrationContract = Registration(registration);

        if (!RegistrationContract.FishSeedCompanyExists(msg.sender))
            revert("Sender not authorized");

        registrationContract = registration;
        FishSeedCompany = msg.sender;
        SpeciesName = Speciesname;
        GeographicOrigin = Geographicorigin;
        NumberOfFishSeedsAvailable = NumberOfFishSeedsavailable;
        IPFS_Hash = IPFShash;
        methodOfReproduction = MethodOfReproduction;
        waterTemperature = WaterTemperature;
        images = Images;

        emit FishSeedsDescriptionsSet(
            SpeciesName,
            GeographicOrigin,
            methodOfReproduction,
            NumberOfFishSeedsAvailable,
            waterTemperature,
            images,
            IPFS_Hash
        );
    }

    modifier onlyFishSeedCompany() {
        require(
            RegistrationContract.FishSeedCompanyExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    enum status {
        Accepted,
        Rejected,
        Pending,
        Arrived,
        Received,
        Updated
    }

    struct FishSeedsPurchaseOrderDetails {
        address purchaser;
        address seller;
        uint256 NumberOfFishSeedsOrdered;
        status FishSeedsPurchaseOrderDetailsStatus;
    }

    event FishSeedsPurchaseOrderPlaced(
        bytes32 FishSeedsPurchaseOrderID,
        address FishSeedsPurchaser,
        address FishSeedsSeller,
        uint256 NumberOfFishSeedsOrdered,
        uint256 NumberOfFishSeedsAvailable,
        status FishSeedsPurchaseOrderDetailsStatus
    );
    event FishSeedsPurchaseOrderConfirmed(
        bytes32 FishSeedsPurchaseOrderID,
        uint256 NumberOfFishSeedsAvailable,
        status NEWSTatus
    );
    event FishsSeedsOrderReceived(
        bytes32 FishSeedsPurchaseOrderID,
        uint256 NumberOfFishSeedsAvailable,
        status NEWSTatus
    );

    modifier onlyFishSeedsPurchaser() {
        require(
            RegistrationContract.FishFarmerExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }
    modifier onlyFishSeedsSeller() {
        require(
            RegistrationContract.FishSeedCompanyExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    mapping(bytes32 => FishSeedsPurchaseOrderDetails)
        public GetFishSeedsPurchaseOrderID;

    function UpdateFishSeed(
        address FishSeedUploader,
        string memory Speciesname,
        string memory Geographicorigin,
        uint256 NumberOfFishSeedsavailable,
        string memory IPFShash,
        string memory MethodOfReproduction,
        string memory Images,
        uint256 WaterTemperature
    ) public onlyFishSeedCompany {
        require(
            RegistrationContract.FishSeedCompanyExists(FishSeedUploader),
            "Fish seed company is not authorized."
        );

        FishSeedCompany = FishSeedUploader;
        SpeciesName = Speciesname;
        GeographicOrigin = Geographicorigin;
        NumberOfFishSeedsAvailable = NumberOfFishSeedsavailable;
        IPFS_Hash = IPFShash;
        methodOfReproduction = MethodOfReproduction;
        waterTemperature = WaterTemperature;
        images = Images;

        emit FishSeedsDescriptionsSet(
            SpeciesName,
            GeographicOrigin,
            methodOfReproduction,
            NumberOfFishSeedsAvailable,
            waterTemperature,
            images,
            IPFS_Hash
        );
    }

    function PlaceFishSeedsPurchaseOrder(
        address FishSeedsPurchaser,
        address FishSeedsSeller,
        uint256 NumberOfFishSeedsOrdered
    ) public onlyFishSeedsPurchaser {
        require(
            RegistrationContract.FishFarmerExists(FishSeedsPurchaser),
            "FishSeedPurchaser not authorized."
        );
        require(
            NumberOfFishSeedsOrdered <= NumberOfFishSeedsAvailable,
            "Not enough fish seeds available."
        );

        bytes32 temp = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                FishSeedsSeller,
                NumberOfFishSeedsOrdered
            )
        );
        GetFishSeedsPurchaseOrderID[temp] = FishSeedsPurchaseOrderDetails(
            msg.sender,
            FishSeedsSeller,
            NumberOfFishSeedsOrdered,
            status.Pending
        );
        NumberOfFishSeedsAvailable -= NumberOfFishSeedsOrdered;
        emit FishSeedsPurchaseOrderPlaced(
            temp,
            msg.sender,
            FishSeedsSeller,
            NumberOfFishSeedsOrdered,
            NumberOfFishSeedsAvailable,
            status.Pending
        );
    }

    function ConfirmFishSeedsPurchaseOrder(
        bytes32 FishSeedsPurchaseOrderID,
        bool accepted
    ) public onlyFishSeedsSeller {
        require(
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID].seller ==
                msg.sender,
            "FishSeedsCompany is not authorized."
        );
        require(
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
                .FishSeedsPurchaseOrderDetailsStatus == status.Pending
        );

        if (accepted) {
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
                .FishSeedsPurchaseOrderDetailsStatus = status.Accepted;
        } else {
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
                .FishSeedsPurchaseOrderDetailsStatus = status.Rejected;
            uint256 NumberOfFishSeedsOrdered = GetFishSeedsPurchaseOrderID[
                FishSeedsPurchaseOrderID
            ].NumberOfFishSeedsOrdered;
            NumberOfFishSeedsAvailable += NumberOfFishSeedsOrdered;
        }
        emit FishSeedsPurchaseOrderConfirmed(
            FishSeedsPurchaseOrderID,
            NumberOfFishSeedsAvailable,
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
                .FishSeedsPurchaseOrderDetailsStatus
        );
    }

    function ReceiveFishSeedsOrder(bytes32 FishSeedsPurchaseOrderID)
        public
        onlyFishSeedsPurchaser
    {
        require(
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID].purchaser ==
                msg.sender,
            "Sender not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
                        .FishSeedsPurchaseOrderDetailsStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
            .FishSeedsPurchaseOrderDetailsStatus = status.Received;

        emit FishsSeedsOrderReceived(
            FishSeedsPurchaseOrderID,
            NumberOfFishSeedsAvailable,
            GetFishSeedsPurchaseOrderID[FishSeedsPurchaseOrderID]
                .FishSeedsPurchaseOrderDetailsStatus
        );
    }

    struct FarmedFishGrowthDetails {
        address FarmedFishGrowthDetailsUploader;
        uint256 FishWeight;
        uint256 TotalNumberOfFish;
        uint256 waterTemperature;
        string IPFShash;
        string Image;
        status FarmedFishGrowthDetailsStatus;
    }

    modifier onlyFarmedFishGrowthDetailsUploader() {
        require(
            RegistrationContract.FishFarmerExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }
    mapping(bytes32 => FarmedFishGrowthDetails)
        public GetFarmedFishGrowthDetailsID;
    event FarmedFishGrowthDetailsUpdated(
        bytes32 FarmedFishGrowthDetailsID,
        address FishGrowthDetailsUploader,
        uint256 FishWeight,
        uint256 TotalNumberOfFish,
        uint256 waterTemperature,
        string Image,
        string IPFShash
    );

    function UpdateFarmedFishGrowthDetails(
        address FarmedFishGrowthDetailsUploader,
        uint256 FishWeight,
        uint256 TotalNumberOfFish,
        uint256 WaterTemperature,
        string memory Image,
        string memory IPFShash
    ) public onlyFarmedFishGrowthDetailsUploader {
        require(
            RegistrationContract.FishFarmerExists(
                FarmedFishGrowthDetailsUploader
            ),
            "FishFarmer is not authorized."
        );
        bytes32 tebp = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                TotalNumberOfFish,
                FishWeight,
                WaterTemperature,
                Image,
                IPFShash
            )
        );
        GetFarmedFishGrowthDetailsID[tebp] = FarmedFishGrowthDetails(
            FarmedFishGrowthDetailsUploader,
            FishWeight,
            TotalNumberOfFish,
            WaterTemperature,
            IPFShash,
            Image,
            status.Updated
        );

        emit FarmedFishGrowthDetailsUpdated(
            tebp,
            FarmedFishGrowthDetailsUploader,
            FishWeight,
            TotalNumberOfFish,
            waterTemperature,
            Image,
            IPFShash
        );
    }

    modifier onlyFarmedFishPurchaser() {
        require(
            RegistrationContract.FishProcessorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    modifier onlyFarmedFishSeller() {
        require(
            RegistrationContract.FishFarmerExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    struct FarmedFishPurchaseOrderDetails {
        address FarmedFishpurchaser;
        uint256 NumberOfFishOrdered;
        address FarmedFishseller;
        status FarmedFishPurchaseOrderDetailsStatus;
    }
    mapping(bytes32 => FarmedFishPurchaseOrderDetails)
        public GetFarmedFishPurchaseOrderID;
    event FarmedFishPurchaseOrderPlaced(
        bytes32 FarmedFishPurchaseOrderID,
        address FarmedFishPurchaser,
        address FarmedFishSeller,
        uint256 TotalNumberOfFish,
        uint256 NumberOfFishOrdered,
        status FarmedFishPurchaseOrderDetailsStatus
    );
    event FarmedFishPurchaseOrderReceived(
        bytes32 FarmedFishPurchaseOrderID,
        uint256 TotalNumberOfFish,
        status NEWStatus
    );
    event FarmedFishOrderReceived(
        bytes32 FarmedFishPurchaseOrderID,
        status NEWStatus
    );

    function PlaceFarmedFishPurchaseOrder(
        bytes32 FarmedFishGrowthDetailsID,
        address FarmedFishPurchaser,
        uint256 NumberOfFishOrdered,
        address FarmedFishSeller
    ) public onlyFarmedFishPurchaser {
        require(
            RegistrationContract.FishProcessorExists(FarmedFishPurchaser),
            "FishProcessor not authorized."
        );
        require(
            NumberOfFishOrdered <=
                GetFarmedFishGrowthDetailsID[FarmedFishGrowthDetailsID]
                    .TotalNumberOfFish,
            "Not enough fishs available."
        );
        bytes32 temp1 = keccak256(
            abi.encodePacked(msg.sender, NumberOfFishOrdered)
        );
        GetFarmedFishPurchaseOrderID[temp1] = FarmedFishPurchaseOrderDetails(
            FarmedFishPurchaser,
            NumberOfFishOrdered,
            FarmedFishSeller,
            status.Pending
        );

        GetFarmedFishGrowthDetailsID[FarmedFishGrowthDetailsID]
            .TotalNumberOfFish -= NumberOfFishOrdered;

        emit FarmedFishPurchaseOrderPlaced(
            temp1,
            FarmedFishPurchaser,
            FarmedFishSeller,
            GetFarmedFishGrowthDetailsID[FarmedFishGrowthDetailsID]
                .TotalNumberOfFish,
            NumberOfFishOrdered,
            status.Pending
        );
    }

    function ConfirmFarmedFishPurchaseOrder(
        bytes32 FarmedFishPurchaseOrderID,
        bytes32 FarmedFishGrowthDetailsID,
        bool Accepted
    ) public onlyFarmedFishSeller {
        require(
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishseller == msg.sender,
            "Fish farmer is not authorized."
        );
        require(
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishPurchaseOrderDetailsStatus == status.Pending
        );

        if (Accepted) {
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishPurchaseOrderDetailsStatus = status.Accepted;
        } else {
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishPurchaseOrderDetailsStatus = status.Rejected;

            uint256 NumberOfFishOrdered = GetFarmedFishPurchaseOrderID[
                FarmedFishPurchaseOrderID
            ].NumberOfFishOrdered;

            GetFarmedFishGrowthDetailsID[FarmedFishGrowthDetailsID]
                .TotalNumberOfFish += NumberOfFishOrdered;
        }
        emit FarmedFishPurchaseOrderReceived(
            FarmedFishPurchaseOrderID,
            GetFarmedFishGrowthDetailsID[FarmedFishGrowthDetailsID]
                .TotalNumberOfFish,
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishPurchaseOrderDetailsStatus
        );
    }

    function ReceiveFarmedFishOrder(bytes32 FarmedFishPurchaseOrderID)
        public
        onlyFarmedFishPurchaser
    {
        require(
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishpurchaser == msg.sender,
            "Sender not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                        .FarmedFishPurchaseOrderDetailsStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
            .FarmedFishPurchaseOrderDetailsStatus = status.Received;

        emit FarmedFishOrderReceived(
            FarmedFishPurchaseOrderID,
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishPurchaseOrderDetailsStatus
        );
    }
}

contract FishProcessing {
    string public ProcessedSpeciesName;
    string public IPFS_Hash;
    uint256 public FilletsInPacket;
    uint256 public NumberOfPackets;
    uint256 public DateOfProcessing;
    uint256 public DateOfExpiry;
    address registrationContract;
    address public FishProcessor;
    bytes32 FarmedFishPurchaseOrderID;
    string public Image;

    Registration RegistrationContract;

    struct ProcessedFishPackageDetails {
        string SpeciesName;
        uint256 FilletsInPacket;
        uint256 NumberOfPackets;
    }
    enum status {
        Accepted,
        Rejected,
        Pending,
        Arrived,
        Received,
        Updated
    }

    modifier onlyProcessor() {
        require(
            RegistrationContract.FishProcessorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    event ProcessedFishPackageIDCreated(
        bytes32 FarmedFishPurchaseOrderID,
        string ProcessedSpeciesName,
        string IPFS_Hash,
        uint256 DateOfProcessing,
        uint256 DateOfExpiry,
        uint256 FilletsInPacket,
        uint256 NumberOfPackets,
        string Image
    );

    constructor(
        bytes32 farmedFishPurchaseOrderID,
        address registration,
        string memory processedSpeciesname,
        string memory ipfsHash,
        uint256 dateOfProcessing,
        uint256 dateOfExpiry,
        uint256 filletsInPacket,
        uint256 numberOfPackets,
        string memory image
    ) public {
        RegistrationContract = Registration(registration);

        if (!RegistrationContract.FishProcessorExists(msg.sender))
            revert("Sender not authorized");

        if (dateOfExpiry < dateOfProcessing)
            revert("Date of expiry cannot be before date of processing");

        registrationContract = registration;
        FishProcessor = msg.sender;
        ProcessedSpeciesName = processedSpeciesname;
        IPFS_Hash = ipfsHash;
        DateOfProcessing = dateOfProcessing;
        DateOfExpiry = dateOfExpiry;
        FilletsInPacket = filletsInPacket;
        NumberOfPackets = numberOfPackets;
        FarmedFishPurchaseOrderID = farmedFishPurchaseOrderID;
        Image = image;

        emit ProcessedFishPackageIDCreated(
            FarmedFishPurchaseOrderID,
            ProcessedSpeciesName,
            IPFS_Hash,
            DateOfProcessing,
            DateOfExpiry,
            FilletsInPacket,
            NumberOfPackets,
            Image
        );
    }

    function UpdateFishProcessing(
        string memory processedSpeciesname,
        string memory ipfsHash,
        uint256 dateOfProcessing,
        uint256 dateOfExpiry,
        uint256 filletsInPacket,
        uint256 numberOfPackets,
        string memory image
    ) public onlyProcessor {
        if (!RegistrationContract.FishProcessorExists(msg.sender))
            revert("Sender not authorized");

        if (dateOfExpiry < dateOfProcessing)
            revert("Date of expiry cannot be before date of processing");

        ProcessedSpeciesName = processedSpeciesname;
        IPFS_Hash = ipfsHash;
        DateOfProcessing = dateOfProcessing;
        DateOfExpiry = dateOfExpiry;
        FilletsInPacket = filletsInPacket;
        NumberOfPackets = numberOfPackets;
        Image = image;

        emit ProcessedFishPackageIDCreated(
            FarmedFishPurchaseOrderID,
            ProcessedSpeciesName,
            IPFS_Hash,
            DateOfProcessing,
            DateOfExpiry,
            FilletsInPacket,
            NumberOfPackets,
            Image
        );
    }

    modifier onlyOrderer() {
        require(
            RegistrationContract.DistributorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    modifier onlyReceiver() {
        require(
            RegistrationContract.FishProcessorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    struct ProcessedFishPurchaseOrder {
        address receiver;
        address orderer;
        uint256 QuantityofFishPackageOrdered;
        status ProcessedFishPurchaseOrderStatus;
    }

    event ProcessedFishPuchaseOrderPlaced(
        bytes32 ProcessedFishPurchaseOrderID,
        address ReceiverEA,
        uint256 quantityoffishpackageordered,
        address OrdererEA,
        uint256 NumberOfPackets
    );

    event ConfirmProcessedFishPurchaseOrderStatus(
        bytes32 ProcessedFishPurchaseOrderID,
        uint256 NumberOfPackets,
        status NewStatus
    );

    event ProcessedFishOrderReceived(bytes32 ProcessedFishPurchaseOrderID);

    mapping(bytes32 => ProcessedFishPurchaseOrder)
        public GetProcessedFishPurchaseOrderID;

    function PlaceProcessedFishPurchaseOrder(
        address orderer,
        uint256 quantityoffishpackageordered,
        address Receiver
    ) public onlyOrderer {
        require(
            RegistrationContract.DistributorExists(orderer),
            "Distributor’s address is not valid"
        );

        require(
            quantityoffishpackageordered <= NumberOfPackets,
            "Not enough packets available"
        );

        require(now <= DateOfExpiry, "Date of expiry has passed.");

        bytes32 temp = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                quantityoffishpackageordered,
                Receiver
            )
        );

        GetProcessedFishPurchaseOrderID[temp] = ProcessedFishPurchaseOrder(
            Receiver,
            msg.sender,
            quantityoffishpackageordered,
            status.Pending
        );

        NumberOfPackets -= quantityoffishpackageordered;

        emit ProcessedFishPuchaseOrderPlaced(
            temp,
            Receiver,
            quantityoffishpackageordered,
            msg.sender,
            NumberOfPackets
        );
    }

    function ConfirmProcessedFishPurchaseOrder(
        bytes32 ProcessedFishPurchaseOrderID,
        bool Accepted
    ) public onlyReceiver {
        require(
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .receiver == msg.sender,
            "The receiver of the order is not authorized"
        );
        require(
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .ProcessedFishPurchaseOrderStatus == status.Pending
        );
        if (Accepted) {
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .ProcessedFishPurchaseOrderStatus = status.Accepted;
        } else {
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .ProcessedFishPurchaseOrderStatus = status.Rejected;

            uint256 QuantityofFishPackageOrdered = GetProcessedFishPurchaseOrderID[
                    ProcessedFishPurchaseOrderID
                ].QuantityofFishPackageOrdered;

            NumberOfPackets += QuantityofFishPackageOrdered;
        }
        emit ConfirmProcessedFishPurchaseOrderStatus(
            ProcessedFishPurchaseOrderID,
            NumberOfPackets,
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .ProcessedFishPurchaseOrderStatus
        );
    }

    function ReceiveProcessedFishOrder(bytes32 ProcessedFishPurchaseOrderID)
        public
        onlyOrderer
    {
        require(
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .orderer == msg.sender,
            "Sender not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetProcessedFishPurchaseOrderID[
                        ProcessedFishPurchaseOrderID
                    ].ProcessedFishPurchaseOrderStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
            .ProcessedFishPurchaseOrderStatus = status.Received;

        emit ProcessedFishOrderReceived(ProcessedFishPurchaseOrderID);
    }

    struct RetailerPurchaseOrderDetails {
        address buyer;
        address seller;
        bytes32 ProcessedFishPurchaseOrderID;
        uint256 NumberOfFishPackagesOrdered;
        status RetailerPurchaseOrderStatus;
    }

    mapping(bytes32 => RetailerPurchaseOrderDetails)
        public GetRetailerPurchaseOrderID;

    modifier onlyBuyer() {
        require(
            RegistrationContract.RetailerExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    modifier onlySeller() {
        require(
            RegistrationContract.DistributorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    event RetailerPuchaseOrderPlaced(
        bytes32 RetailerPurchaseOrderID,
        address Buyer,
        address Seller,
        bytes32 ProcessedFishPurchaseOrderID,
        uint256 NumberOfFishPackagesOrdered,
        uint256 NumberOfFishPackages
    );
    event RetailerPurchaseOrderConfirmed(
        bytes32 RetailerPurchaseOrderID,
        uint256 NumberOfFishPackages,
        status newstatuS
    );
    event RetailerOrderReceived(bytes32 RetailerPurchaseOrderID);

    function PlaceRetailerPurchaseOrder(
        address buyer,
        address seller,
        bytes32 ProcessedFishPurchaseOrderID,
        uint256 NumberOfFishPackagesOrdered
    ) public onlyBuyer {
        require(
            RegistrationContract.RetailerExists(buyer),
            "Retailer’s address is not valid"
        );
        require(
            NumberOfFishPackagesOrdered <=
                GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                    .QuantityofFishPackageOrdered,
            "Not enough packets available"
        );

        bytes32 temp1 = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                ProcessedFishPurchaseOrderID,
                NumberOfFishPackagesOrdered,
                seller
            )
        );
        GetRetailerPurchaseOrderID[temp1] = RetailerPurchaseOrderDetails(
            msg.sender,
            seller,
            ProcessedFishPurchaseOrderID,
            NumberOfFishPackagesOrdered,
            status.Pending
        );

        GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
            .QuantityofFishPackageOrdered -= NumberOfFishPackagesOrdered;

        emit RetailerPuchaseOrderPlaced(
            temp1,
            msg.sender,
            seller,
            ProcessedFishPurchaseOrderID,
            NumberOfFishPackagesOrdered,
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .QuantityofFishPackageOrdered
        );
    }

    function ConfirmRetailerPurchaseOrder(
        bytes32 RetailerPurchaseOrderID,
        bytes32 ProcessedFishPurchaseOrderID,
        bool accepted
    ) public onlySeller {
        require(
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID].seller ==
                msg.sender,
            "Sender not authorized."
        );
        require(
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
                .RetailerPurchaseOrderStatus == status.Pending
        );

        if (accepted) {
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
                .RetailerPurchaseOrderStatus = status.Accepted;
        } else {
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
                .RetailerPurchaseOrderStatus = status.Rejected;

            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .QuantityofFishPackageOrdered += GetRetailerPurchaseOrderID[
                RetailerPurchaseOrderID
            ].NumberOfFishPackagesOrdered;
        }

        emit RetailerPurchaseOrderConfirmed(
            RetailerPurchaseOrderID,
            GetProcessedFishPurchaseOrderID[ProcessedFishPurchaseOrderID]
                .QuantityofFishPackageOrdered,
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
                .RetailerPurchaseOrderStatus
        );
    }

    function ReceiveRetailerOrder(bytes32 RetailerPurchaseOrderID)
        public
        onlyBuyer
    {
        require(
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID].buyer ==
                msg.sender,
            "Buyer not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
                        .RetailerPurchaseOrderStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
            .RetailerPurchaseOrderStatus = status.Received;

        emit RetailerOrderReceived(RetailerPurchaseOrderID);
    }

    function UpdateQuantityOfProduct(
        bytes32 RetailerPurchaseOrderID,
        uint256 NumberOfFishPackage
    ) public onlyBuyer {
        require(
            GetRetailerPurchaseOrderID[RetailerPurchaseOrderID].buyer ==
                msg.sender,
            "Buyer not authorized."
        );

        GetRetailerPurchaseOrderID[RetailerPurchaseOrderID]
            .NumberOfFishPackagesOrdered = NumberOfFishPackage;
    }
}
