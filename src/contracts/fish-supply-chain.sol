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
        string speciesname;
        string IPFShash;
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
        string speciesname
    );

    function UpdateFarmedFishGrowthDetails(
        address FarmedFishGrowthDetailsUploader,
        uint256 FishWeight,
        uint256 TotalNumberOfFish,
        string memory speciesname,
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
                speciesname
            )
        );
        GetFarmedFishGrowthDetailsID[tebp] = FarmedFishGrowthDetails(
            FarmedFishGrowthDetailsUploader,
            FishWeight,
            TotalNumberOfFish,
            speciesname,
            IPFShash,
            status.Updated
        );

        emit FarmedFishGrowthDetailsUpdated(
            tebp,
            FarmedFishGrowthDetailsUploader,
            FishWeight,
            TotalNumberOfFish,
            speciesname
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
        string speciesname;
        address FarmedFishseller;
        status FarmedFishPurchaseOrderDetailsStatus;
    }
    mapping(bytes32 => FarmedFishPurchaseOrderDetails)
        public GetFarmedFishPurchaseOrderID;
    event FarmedFishPurchaseOrderPlaced(bytes32 FarmedFishPurchaseOrderID);
    event FarmedFishPurchaseOrderReceived(
        bytes32 FarmedFishPurchaseOrderID,
        status NEWStatus
    );
    event FarmedFishOrderReceived(bytes32 FarmedFishPurchaseOrderID);

    function PlaceFarmedFishPurchaseOrder(
        address FarmedFishPurchaser,
        uint256 NumberOfFishOrdered,
        string memory speciesname,
        address FarmedFishSeller
    ) public onlyFarmedFishPurchaser {
        require(
            RegistrationContract.FishProcessorExists(FarmedFishPurchaser),
            "FishProcessor not authorized."
        );
        bytes32 temp1 = keccak256(
            abi.encodePacked(msg.sender, NumberOfFishOrdered, speciesname)
        );
        GetFarmedFishPurchaseOrderID[temp1] = FarmedFishPurchaseOrderDetails(
            FarmedFishPurchaser,
            NumberOfFishOrdered,
            speciesname,
            FarmedFishSeller,
            status.Pending
        );
        emit FarmedFishPurchaseOrderPlaced(temp1);
    }

    function ConfirmFarmedFishPurchaseOrder(
        bytes32 FarmedFishPurchaseOrderID,
        bool Accepted
    ) public onlyFarmedFishSeller {
        require(
            GetFarmedFishPurchaseOrderID[FarmedFishPurchaseOrderID]
                .FarmedFishseller == msg.sender,
            "FarmedFishPOReceiver is not authorized."
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
        }
        emit FarmedFishPurchaseOrderReceived(
            FarmedFishPurchaseOrderID,
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

        emit FarmedFishOrderReceived(FarmedFishPurchaseOrderID);
    }
}

contract WildCaughtFish {
    string public SpeciesName;
    string public GeographicOrigin;
    string public TypeOfEcosystem;
    uint256 public NumberOfWildCaughtFishAvaliable;
    string public WaterType;
    uint256 public DateOfCatch;
    address registrationContract;
    address public WildCaughtFisher;

    Registration RegistrationContract;

    event WildCaughtFishDetailsUpdated(
        string SpeciesName,
        string GeographicOrigin,
        string TypeOfEcosystem,
        uint256 NumberOfWildCaughtFishAvaliable,
        string WaterType,
        uint256 DateOfCatch,
        address WildCaughtFisher
    );

    constructor(
        address registration,
        string memory Speciesname,
        string memory Geographicorigin,
        string memory TypeOfEcoSystem,
        uint256 NumberOfWildCaughtfishavailable,
        string memory Watertype,
        uint256 DateofCatch
    ) public {
        RegistrationContract = Registration(registration);

        if (!RegistrationContract.WildCaughtFisherExists(msg.sender))
            revert("Sender not authorized");

        registrationContract = registration;
        WildCaughtFisher = msg.sender;
        SpeciesName = Speciesname;
        GeographicOrigin = Geographicorigin;
        TypeOfEcosystem = TypeOfEcoSystem;
        NumberOfWildCaughtFishAvaliable = NumberOfWildCaughtfishavailable;
        WaterType = Watertype;
        DateOfCatch = DateofCatch;
        emit WildCaughtFishDetailsUpdated(
            SpeciesName,
            GeographicOrigin,
            TypeOfEcosystem,
            NumberOfWildCaughtFishAvaliable,
            WaterType,
            DateOfCatch,
            WildCaughtFisher
        );
    }

    modifier onlyWildCaughtFishPurchaser() {
        require(
            RegistrationContract.FishProcessorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    modifier onlyWildCaughtFishSeller() {
        require(
            RegistrationContract.WildCaughtFisherExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }
    enum status {
        Accepted,
        Rejected,
        Pending,
        Received
    }

    struct WildCaughtFishPurchaseOrderDetails {
        address WildCaughtFishPurchaser;
        uint256 NumberOfWildCaughtFishOrdered;
        address WildCaughtFishSeller;
        status WildCaughtFishPurchaseOrderDetailsStatus;
    }
    mapping(bytes32 => WildCaughtFishPurchaseOrderDetails)
        public GetWildCaughtFishPurchaseOrderID;
    event WildCaughtFishPurchaseOrderPlaced(
        bytes32 WildCaughtFishPurchaseOrderID,
        address WildCaughtFishPurchaser,
        uint256 NumberOfWildCaughtFishOrdered,
        address WildCaughtFishSeller
    );
    event WildCaughtFishPurchaseOrderReceived(
        bytes32 WildCaughtFishPurchaseOrderID,
        status newsTatus
    );
    event WildCaughtFishOrderReceived(
        bytes32 WildCaughtFishPurchaseOrderID,
        status WildCaughtFishPurchaseOrderDetailsStatus
    );

    // get info contract
    function GetFarmedFishContractInfo() public view returns (address) {
        return registrationContract;
    }

    function PlaceWildCaughtFishPurchaseOrder(
        address WildCaughtFishPurchaser,
        uint256 NumberOfWildCaughtFishOrdered,
        address WildCaughtFishSeller
    ) public onlyWildCaughtFishPurchaser {
        require(
            RegistrationContract.FishProcessorExists(WildCaughtFishPurchaser),
            "FishProcessor not authorized."
        );
        bytes32 temp2 = keccak256(
            abi.encodePacked(
                msg.sender,
                NumberOfWildCaughtFishOrdered,
                WildCaughtFishSeller
            )
        );
        GetWildCaughtFishPurchaseOrderID[
            temp2
        ] = WildCaughtFishPurchaseOrderDetails(
            msg.sender,
            NumberOfWildCaughtFishOrdered,
            WildCaughtFishSeller,
            status.Pending
        );
        emit WildCaughtFishPurchaseOrderPlaced(
            temp2,
            msg.sender,
            NumberOfWildCaughtFishOrdered,
            WildCaughtFishSeller
        );
    }

    function ConfirmWildCaughtFishPurchaseOrder(
        bytes32 WildCaughtFishPurchaseOrderID,
        bool Accepted
    ) public onlyWildCaughtFishSeller {
        require(
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishSeller == msg.sender,
            "WildCaughtFishSeller is not authorized."
        );
        require(
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus == status.Pending
        );
        if (Accepted) {
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus = status.Accepted;
        } else {
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus = status.Rejected;
        }
        emit WildCaughtFishPurchaseOrderReceived(
            WildCaughtFishPurchaseOrderID,
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus
        );
    }

    function ReceiveWildCaughtFishOrder(
        bytes32 WildCaughtFishPurchaseOrderID,
        bool Received
    ) public onlyWildCaughtFishPurchaser {
        require(
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaser == msg.sender,
            "Sender not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetWildCaughtFishPurchaseOrderID[
                        WildCaughtFishPurchaseOrderID
                    ].WildCaughtFishPurchaseOrderDetailsStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        if (Received) {
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus = status.Received;
        } else {
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus = status.Received;
        }
        emit WildCaughtFishOrderReceived(
            WildCaughtFishPurchaseOrderID,
            GetWildCaughtFishPurchaseOrderID[WildCaughtFishPurchaseOrderID]
                .WildCaughtFishPurchaseOrderDetailsStatus
        );
    }
}

contract FishProcessing {
    string public ProcessedSpeciesName;
    string public IPFS_Hash;
    string public CatchMethod;
    uint256 public FilletsInPacket;
    uint256 public NumberOfPackets;
    uint256 public DateOfProcessing;
    address registrationContract;
    address public FishProcessor;
    bytes32 ProcessedFishPackageID;
    bytes32 PackageId;

    Registration RegistrationContract;

    struct ProcessedFishPackageDetails {
        string SpeciesName;
        string CatchMethod;
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
    mapping(bytes32 => ProcessedFishPackageDetails) ProcessedFishpackageId;
    event ProcessedFishPackageIDCreated(
        bytes32 ProcessedFishpackageId,
        string ProcessedSpeciesName,
        string IPFS_Hash,
        uint256 DateOfProcessing,
        string CatchMethod,
        uint256 FilletsInPacket,
        uint256 NumberOfPackets
    );

    constructor(
        address registration,
        string memory processedSpeciesname,
        string memory ipfsHash,
        uint256 dateOfProcessing,
        string memory catchMethod,
        uint256 filletsInPacket,
        uint256 numberOfPackets
    ) public {
        RegistrationContract = Registration(registration);

        if (!RegistrationContract.FishProcessorExists(msg.sender))
            revert("Sender not authorized");
        registrationContract = registration;
        FishProcessor = msg.sender;
        ProcessedSpeciesName = processedSpeciesname;
        IPFS_Hash = ipfsHash;
        DateOfProcessing = dateOfProcessing;
        CatchMethod = catchMethod;
        FilletsInPacket = filletsInPacket;
        NumberOfPackets = numberOfPackets;

        bytes32 tenp = keccak256(
            abi.encodePacked(
                msg.sender,
                processedSpeciesname,
                catchMethod,
                filletsInPacket,
                numberOfPackets
            )
        );

        ProcessedFishpackageId[tenp] = ProcessedFishPackageDetails(
            processedSpeciesname,
            catchMethod,
            filletsInPacket,
            numberOfPackets
        );
        PackageId = tenp;

        emit ProcessedFishPackageIDCreated(
            tenp,
            ProcessedSpeciesName,
            IPFS_Hash,
            DateOfProcessing,
            CatchMethod,
            FilletsInPacket,
            NumberOfPackets
        );
    }

    function GetProcessedFishPackageID() public view returns (bytes32) {
        return PackageId;
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
        bytes32 ProcessedFishPackageID;
        address orderer;
        uint256 QuantityofFishPackageOrdered;
        status ProcessedFishPurchaseOrderStatus;
    }

    event ProcessedFishPuchaseOrderPlaced(
        bytes32 ProcessedFishPurchaseOrderID,
        address ReceiverEA,
        bytes32 ProcessedFishPackageID,
        uint256 quantityoffishpackageordered,
        address OrdererEA
    );

    event ConfirmProcessedFishPurchaseOrderStatus(
        bytes32 ProcessedFishPurchaseOrderID,
        status NewStatus
    );

    event ProcessedFishOrderReceived(bytes32 ProcessedFishPurchaseOrderID);

    mapping(bytes32 => ProcessedFishPurchaseOrder)
        public GetProcessedFishPurchaseOrderID;

    function PlaceProcessedFishPurchaseOrder(
        address orderer,
        bytes32 ProcessedFishPackageId,
        uint256 quantityoffishpackageordered,
        address Receiver
    ) public onlyOrderer {
        require(
            RegistrationContract.DistributorExists(orderer),
            "Distributor’s address is not valid"
        );

        bytes32 temp = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                ProcessedFishPackageId,
                quantityoffishpackageordered,
                Receiver
            )
        );
        GetProcessedFishPurchaseOrderID[temp] = ProcessedFishPurchaseOrder(
            Receiver,
            ProcessedFishPackageId,
            msg.sender,
            quantityoffishpackageordered,
            status.Pending
        );

        emit ProcessedFishPuchaseOrderPlaced(
            temp,
            Receiver,
            ProcessedFishPackageId,
            quantityoffishpackageordered,
            msg.sender
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
        }
        emit ConfirmProcessedFishPurchaseOrderStatus(
            ProcessedFishPurchaseOrderID,
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
        uint256 NumberOfFishPackagesOrdered
    );
    event RetailerPurchaseOrderConfirmed(
        bytes32 RetailerPurchaseOrderID,
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

        emit RetailerPuchaseOrderPlaced(
            temp1,
            msg.sender,
            seller,
            ProcessedFishPurchaseOrderID,
            NumberOfFishPackagesOrdered
        );
    }

    function ConfirmRetailerPurchaseOrder(
        bytes32 RetailerPurchaseOrderID,
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
        }

        emit RetailerPurchaseOrderConfirmed(
            RetailerPurchaseOrderID,
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

    struct ConsumerOrderDetails {
        bytes32 RetailerPurchaseOrderID;
        address vendor;
        address vendee;
        status ConsumerOrderDetailsStatus;
    }

    mapping(bytes32 => ConsumerOrderDetails) public GetConsumerOrderID;

    modifier onlyVendor() {
        require(
            RegistrationContract.RetailerExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    modifier onlyVendee() {
        require(
            RegistrationContract.ConsumerExists(msg.sender),
            "Sender not autorized."
        );
        _;
    }

    event ConsumerOrderPlaced(
        bytes32 ConsumerOrderID,
        bytes32 RetailerPurchaseOrderID,
        address vendor,
        address vendee
    );
    event ConsumerOrderConfirmed(bytes32 ConsumerOrderID, status newstatus);
    event ConsumerOrderReceived(bytes32 ConsumerOrderID);

    function PlaceConsumerOrder(
        bytes32 RetailerPurchaseOrderID,
        address vendor,
        address vendee
    ) public onlyVendee {
        require(
            RegistrationContract.ConsumerExists(vendee),
            "Consumer is not authorized."
        );
        bytes32 poiu = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                RetailerPurchaseOrderID
            )
        );

        GetConsumerOrderID[poiu] = ConsumerOrderDetails(
            RetailerPurchaseOrderID,
            vendor,
            msg.sender,
            status.Pending
        );

        emit ConsumerOrderPlaced(
            poiu,
            RetailerPurchaseOrderID,
            vendor,
            msg.sender
        );
    }

    function ConfirmConsumerPurchaseOrder(
        bytes32 ConsumerOrderID,
        bool accepted
    ) public onlyVendor {
        require(
            GetConsumerOrderID[ConsumerOrderID].vendor == msg.sender,
            "FishSeedsCompany is not authorized."
        );

        require(
            GetConsumerOrderID[ConsumerOrderID].ConsumerOrderDetailsStatus ==
                status.Pending
        );
        if (accepted) {
            GetConsumerOrderID[ConsumerOrderID]
                .ConsumerOrderDetailsStatus = status.Accepted;
        } else {
            GetConsumerOrderID[ConsumerOrderID]
                .ConsumerOrderDetailsStatus = status.Rejected;
        }
        emit ConsumerOrderConfirmed(
            ConsumerOrderID,
            GetConsumerOrderID[ConsumerOrderID].ConsumerOrderDetailsStatus
        );
    }

    function ReceiveConsumerOrder(bytes32 ConsumerOrderID) public onlyVendee {
        require(
            GetConsumerOrderID[ConsumerOrderID].vendee == msg.sender,
            "Sender not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetConsumerOrderID[ConsumerOrderID]
                        .ConsumerOrderDetailsStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        GetConsumerOrderID[ConsumerOrderID].ConsumerOrderDetailsStatus = status
            .Received;

        emit ConsumerOrderReceived(ConsumerOrderID);
    }

    // event FineStatusCreated(address FishProcessor, bool fineStatus);

    // function CreateFineResult(
    //     uint256 NumberOfViolations,
    //     uint256 AcceptabeleNumberofViolations,
    //     address FishProcessor
    // ) public {
    //     require(
    //         RegistrationContract.isFDA(msg.sender) == true,
    //         "only FDA can perform this."
    //     );

    //     Fine = false;

    //     if ((NumberOfViolations) >= AcceptabeleNumberofViolations) {
    //         Fine = true;
    //     }

    //     emit FineStatusCreated(FishProcessor, Fine);
    // }
}

contract FishDistribution {
    address fishprocessingContract;
    bool Fine;

    Registration RegistrationContract;
    FishProcessing FishProcessingContract;

    struct ProcessedFishPurchaseOrder {
        address receiver;
        bytes32 ProcessedFishPackageID;
        address orderer;
        uint256 QuantityofFishPackageOrdered;
        status ProcessedFishPurchaseOrderStatus;
    }
    mapping(bytes32 => ProcessedFishPurchaseOrder)
        public GetProcessedFishPurchaseOrderID;

    modifier onlyDistributor() {
        require(
            RegistrationContract.DistributorExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    enum status {
        Pending,
        Accepted,
        Rejected,
        Received
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
    event ProcessedFishPuchaseOrderPlaced(
        bytes32 ProcessedFishPurchaseOrderID,
        address ReceiverEA,
        bytes32 ProcessedFishPackageID,
        uint256 quantityoffishpackageordered,
        address OrdererEA
    );
    event ConfirmProcessedFishPurchaseOrderStatus(
        bytes32 ProcessedFishPurchaseOrderID,
        status NewStatus
    );
    event ProcessedFishOrderReceived(bytes32 ProcessedFishPurchaseOrderID);

    constructor(address reigstration, address fishprocessing) public {
        RegistrationContract = Registration(reigstration);
        FishProcessingContract = FishProcessing(fishprocessing);

        if (!RegistrationContract.DistributorExists(msg.sender))
            revert("Sender not authorized");
        fishprocessingContract = fishprocessing;
    }

    //
    function PlaceProcessedFishPurchaseOrder(
        address orderer,
        bytes32 ProcessedFishPackageId,
        uint256 quantityoffishpackageordered,
        address Receiver
    ) public onlyOrderer {
        require(
            RegistrationContract.DistributorExists(orderer),
            "Distributor’s address is not valid"
        );

        bytes32 temp = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                ProcessedFishPackageId,
                quantityoffishpackageordered,
                Receiver
            )
        );
        GetProcessedFishPurchaseOrderID[temp] = ProcessedFishPurchaseOrder(
            Receiver,
            ProcessedFishPackageId,
            msg.sender,
            quantityoffishpackageordered,
            status.Pending
        );

        emit ProcessedFishPuchaseOrderPlaced(
            temp,
            Receiver,
            ProcessedFishPackageId,
            quantityoffishpackageordered,
            msg.sender
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
        }
        emit ConfirmProcessedFishPurchaseOrderStatus(
            ProcessedFishPurchaseOrderID,
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
        uint256 NumberOfFishPackagesOrdered
    );
    event RetailerPurchaseOrderConfirmed(
        bytes32 RetailerPurchaseOrderID,
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

        emit RetailerPuchaseOrderPlaced(
            temp1,
            msg.sender,
            seller,
            ProcessedFishPurchaseOrderID,
            NumberOfFishPackagesOrdered
        );
    }

    function ConfirmRetailerPurchaseOrder(
        bytes32 RetailerPurchaseOrderID,
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
        }

        emit RetailerPurchaseOrderConfirmed(
            RetailerPurchaseOrderID,
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

    struct ConsumerOrderDetails {
        bytes32 RetailerPurchaseOrderID;
        address vendor;
        address vendee;
        status ConsumerOrderDetailsStatus;
    }

    mapping(bytes32 => ConsumerOrderDetails) public GetConsumerOrderID;

    modifier onlyVendor() {
        require(
            RegistrationContract.RetailerExists(msg.sender),
            "Sender not authorized."
        );
        _;
    }

    modifier onlyVendee() {
        require(
            RegistrationContract.ConsumerExists(msg.sender),
            "Sender not autorized."
        );
        _;
    }

    event ConsumerOrderPlaced(
        bytes32 ConsumerOrderID,
        bytes32 RetailerPurchaseOrderID,
        address vendor,
        address vendee
    );
    event ConsumerOrderConfirmed(bytes32 ConsumerOrderID, status newstatus);
    event ConsumerOrderReceived(bytes32 ConsumerOrderID);

    function PlaceConsumerOrder(
        bytes32 RetailerPurchaseOrderID,
        address vendor,
        address vendee
    ) public onlyVendee {
        require(
            RegistrationContract.ConsumerExists(vendee),
            "Consumer is not authorized."
        );
        bytes32 poiu = keccak256(
            abi.encodePacked(
                msg.sender,
                now,
                address(this),
                RetailerPurchaseOrderID
            )
        );

        GetConsumerOrderID[poiu] = ConsumerOrderDetails(
            RetailerPurchaseOrderID,
            vendor,
            msg.sender,
            status.Pending
        );

        emit ConsumerOrderPlaced(
            poiu,
            RetailerPurchaseOrderID,
            vendor,
            msg.sender
        );
    }

    function ConfirmConsumerPurchaseOrder(
        bytes32 ConsumerOrderID,
        bool accepted
    ) public onlyVendor {
        require(
            GetConsumerOrderID[ConsumerOrderID].vendor == msg.sender,
            "FishSeedsCompany is not authorized."
        );

        require(
            GetConsumerOrderID[ConsumerOrderID].ConsumerOrderDetailsStatus ==
                status.Pending
        );
        if (accepted) {
            GetConsumerOrderID[ConsumerOrderID]
                .ConsumerOrderDetailsStatus = status.Accepted;
        } else {
            GetConsumerOrderID[ConsumerOrderID]
                .ConsumerOrderDetailsStatus = status.Rejected;
        }
        emit ConsumerOrderConfirmed(
            ConsumerOrderID,
            GetConsumerOrderID[ConsumerOrderID].ConsumerOrderDetailsStatus
        );
    }

    function ReceiveConsumerOrder(bytes32 ConsumerOrderID) public onlyVendee {
        require(
            GetConsumerOrderID[ConsumerOrderID].vendee == msg.sender,
            "Sender not authorized."
        );
        require(
            keccak256(
                abi.encodePacked(
                    GetConsumerOrderID[ConsumerOrderID]
                        .ConsumerOrderDetailsStatus
                )
            ) == keccak256(abi.encodePacked(status.Accepted)),
            "The shipment has not arrived yet"
        );

        GetConsumerOrderID[ConsumerOrderID].ConsumerOrderDetailsStatus = status
            .Received;

        emit ConsumerOrderReceived(ConsumerOrderID);
    }

    event FineStatusCreated(address FishProcessor, bool fineStatus);

    function CreateFineResult(
        uint256 NumberOfViolations,
        uint256 AcceptabeleNumberofViolations,
        address FishProcessor
    ) public {
        require(
            RegistrationContract.isFDA(msg.sender) == true,
            "only FDA can perform this."
        );

        Fine = false;

        if ((NumberOfViolations) >= AcceptabeleNumberofViolations) {
            Fine = true;
        }

        emit FineStatusCreated(FishProcessor, Fine);
    }
}
