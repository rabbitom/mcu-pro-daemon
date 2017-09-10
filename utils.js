function getFirmwarePath() {
    var firmwarePath = process.env.SNAP_DATA;
    if(firmwarePath == null)
        firmwarePath = 'firmwares/';
    else
        firmwarePath += '/';
    return firmwarePath;
}

module.exports.getFirmwarePath = getFirmwarePath;
