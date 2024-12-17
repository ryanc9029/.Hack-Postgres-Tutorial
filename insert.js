import postgresql from './postgresql.js';
import axios from 'axios';

// Define the URL
const url = 'https://palworldapi.azurewebsites.net/v1/pals';
let totalPages = 0;
await axios.get(url)
    .then(async (response) => {
    totalPages=response.data.pagination.totalPages;
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .finally(function () {
    console.log("%d Pages", totalPages);
    });

for(let pageNum=1;pageNum<=totalPages;pageNum++){
    console.log(url+"?Pagination.PageNumber="+pageNum);
    await axios.get(url+"?Pagination.PageNumber="+pageNum)
    .then(async (response) => { // Make the callback function async
        console.log('Retrieved JSON:', response.data);
        const data = response.data.results; // Ensure you have data

        // Insert each record into the database
        postgresql(async (connection) => {
            try {
                // Insert Tribe data
                for (let tribe of data) {
                    const insertTribeText = `
                        INSERT INTO PalTribes (tribeName, localizedName)
                        VALUES ($1, $2)
                        RETURNING tribeid;
                    `;
                    const res = await connection.query(insertTribeText, [tribe.name, tribe.localizedName]);
                    console.log(res);
                    const tribeId = res[0].tribeid;
                    // Insert Pals for each tribe
                    for (let pal of tribe.pals) {
                        const identity = pal.identity;
                        const statistics = pal.statistics;
                        const sensors = pal.sensors;
                        const nutrition = pal.nutrition;
                        const combat = pal.combat;
                        const breeding = pal.breeding;
                        const workSuitability = pal.workSuitability;

                        // Insert Pal data
                        const insertPalText = `
                            INSERT INTO pals (tribeId, paldexIndex, paldexIndexSuffix, palName, localizedName, localizedDescription, isBoss, isGymBoss, 
                                isNocturnal, isEdible, isPredator, element1, element2, size, rarity, expRatio, 
                                stamina, slowWalkSpeed, walkSpeed, runSpeed, rideSprintSpeed, captureRate, price,
                                viewingDistance, viewingAngle, hearingRate, maxFullStomach, fullStomachDecreaseRate, foodAmount,
                                hp, meleeAttack, shotAttack, defense, support, maleProbability, breedingRank, 
                                craftSpeed, transportSpeed, kindling, watering, planting, generatingElectricity, handwork, gathering, 
                                lumbering, mining, oilExtraction, medicineProduction, cooling, transporting, farming)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 
                                $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, 
                                $42, $43, $44, $45, $46, $47, $48, $49, $50, $51)
                        `;
                        const values = [
                            tribeId, identity.paldexIndex, identity.paldexIndexSuffix, identity.name, identity.localizedName, identity.localizedDescription, pal.isBoss, pal.isGymBoss,
                            pal.isNocturnal, pal.isEdible, pal.isPredator, pal.element1, pal.element2, statistics.size, statistics.rarity, 
                            statistics.expRatio, statistics.stamina, statistics.slowWalkSpeed, statistics.walkSpeed, statistics.runSpeed, 
                            statistics.rideSprintSpeed, statistics.captureRate, statistics.price, sensors.viewingDistance, sensors.viewingAngle, 
                            sensors.hearingRate, nutrition.maxFullStomach, nutrition.fullStomachDecreaseRate, nutrition.foodAmount,
                            combat.hp, combat.meleeAttack, combat.shotAttack, combat.defense, combat.support, breeding.maleProbability, 
                            breeding.breedingRank, workSuitability.craftSpeed, workSuitability.transportSpeed, workSuitability.kindling,
                            workSuitability.watering, workSuitability.planting, workSuitability.generatingElectricity, workSuitability.handwork,
                            workSuitability.gathering, workSuitability.lumbering, workSuitability.mining, workSuitability.oilExtraction,
                            workSuitability.medicineProduction, workSuitability.cooling, workSuitability.transporting, workSuitability.farming
                        ];

                        await connection.query(insertPalText, values);
                    }
                }
                console.log('Data inserted successfully');
            } catch (err) {
                console.error('Error inserting data:', err);
            } finally {
                console.log('Ended');
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching data:', error.message);
    });
}


