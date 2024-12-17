import postgresql from './postgresql.js';


postgresql(async (connection) => {
    // Create Tribes table
    await connection.query(`
    CREATE TABLE IF NOT EXISTS PalTribes (
        tribeID SERIAL PRIMARY KEY,
        tribeName VARCHAR(255) NOT NULL,
        localizedName VARCHAR(255) NULL
    );
    `);
    
    // Create Pals table
    await connection.query(`
    CREATE TYPE elements AS ENUM('Unknown', 'Dark', 'Dragon', 'Earth', 'Electricity', 'Fire', 'Ice', 'Leaf', 'Normal', 'Water');
    CREATE TYPE sizes AS ENUM('Unknown', 'XS', 'S', 'M', 'L', 'XL');
    CREATE TABLE IF NOT EXISTS Pals (
        palID SERIAL PRIMARY KEY,
        tribeID INT NOT NULL references PalTribes(tribeID),
        paldexIndex INT NOT NULL,
        paldexIndexSuffix VARCHAR(50),
        palName VARCHAR(255) NOT NULL,
        localizedName VARCHAR(255) NULL,
        localizedDescription TEXT NULL,
        isBoss BOOLEAN NOT NULL DEFAULT FALSE,
        isGymBoss BOOLEAN NOT NULL DEFAULT FALSE,
        isNocturnal BOOLEAN NOT NULL DEFAULT FALSE,
        isEdible BOOLEAN NOT NULL DEFAULT FALSE,
        isPredator BOOLEAN NOT NULL DEFAULT FALSE,
        element1 elements NOT NULL,
        element2 elements NULL,
        size sizes NOT NULL,
        rarity INT NOT NULL,
        expRatio FLOAT NOT NULL,
        stamina INT NOT NULL,
        slowWalkSpeed INT NOT NULL,
        walkSpeed INT NOT NULL,
        runSpeed INT NOT NULL,
        rideSprintSpeed INT NOT NULL,
        captureRate FLOAT NOT NULL,
        price FLOAT NOT NULL,
        viewingDistance INT NOT NULL,
        viewingAngle INT NOT NULL,
        hearingRate FLOAT NOT NULL,
        maxFullStomach INT NOT NULL,
        fullStomachDecreaseRate FLOAT NOT NULL,
        foodAmount INT NOT NULL,
        hp INT NOT NULL,
        meleeAttack INT NOT NULL,
        shotAttack INT NOT NULL,
        defense INT NOT NULL,
        support INT NOT NULL,
        maleProbability FLOAT NOT NULL,
        breedingRank INT NOT NULL,
        craftSpeed INT NOT NULL,
        transportSpeed INT NOT NULL,
        kindling INT NOT NULL,
        watering INT NOT NULL,
        planting INT NOT NULL,
        generatingElectricity INT NOT NULL,
        handwork INT NOT NULL,
        gathering INT NOT NULL,
        lumbering INT NOT NULL,
        mining INT NOT NULL,
        oilExtraction INT NOT NULL,
        medicineProduction INT NOT NULL,
        cooling INT NOT NULL,
        transporting INT NOT NULL,
        farming INT NOT NULL,
        FOREIGN KEY (tribeID) REFERENCES PalTribes(tribeID) ON DELETE CASCADE
    );
    `);

    console.log('PostgreSQL tables created!');
    });