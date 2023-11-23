const laoAddress = require("@lailao10x/lao-address")
const config = require('../../../config')
const { redis } = require('../../../utils')

const allProvince = async (req, res) => {
    try {
        const options = {
            province: "all"
        }
        const provinces = await laoAddress(options)
        return res.status(200).json({
            total: provinces.length,
            data: provinces
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const allCity = async (req, res) => {
    try {
        const provinceId = req.params.id;
        const options = {
            province: provinceId,  // 1 - 18
            district: 'all'
        }
        const district = await laoAddress(options);
        return res.status(200).json({
            name: district.pn_en ,
            total: district.length,
            data: district
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const allVillageInDistrict = async (req, res) => {
    try {
        const districtId = req.params.id;
        const redisVillage = await redis.get('village');
        if (redisVillage) {
            const cachedVillage = JSON.parse(redisVillage);
            return res.status(200).json({
                total: cachedVillage.length,
                data: cachedVillage,
            });
        }
        const options = {
            district: districtId,
            village:"all"
        }
        const village = await laoAddress(options);
        await redis.set('village', JSON.stringify(village), 'EX', config.cache.CACHE_EXPIRE_TIME);
        return res.status(200).json({
            total: village.length,
            data: village
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const allVillage = async (req, res) => {
    try {
        const redisAddress = await redis.get('addresses');
        if (redisAddress) {
            const cachedAddress = JSON.parse(redisAddress);
            return res.status(200).json({
                total: cachedAddress.length,
                data: cachedAddress,
            });
        }
        const options = {
            village: "all"
        };
        const villageData = await laoAddress(options);
        const village = villageData.map((res, index) => {
            return {
                sequence: index + 1,
                vn_la: res.vn,
                vn_en: res.vn_en,
            };
        });
        await redis.set('addresses', JSON.stringify(village), 'EX', config.cache.CACHE_EXPIRE_TIME);
        return res.status(200).json({
            total: village.length,
            data: village
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

module.exports = {
    allCity,
    allProvince,
    allVillage,
    allVillageInDistrict
}