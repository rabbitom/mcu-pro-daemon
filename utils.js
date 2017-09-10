function getFirmwarePath() {
    var firmwarePath = process.env.SNAP_COMMMON;
    if(firmwarePath == null)
        firmwarePath = 'firmwares/';
    else
        firmwarePath += '/';
    return firmwarePath;
}

module.exports.getFirmwarePath = getFirmwarePath;