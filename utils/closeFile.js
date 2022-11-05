function closeFile(data) {
    fs.close(data, (err) => {
        if (err) throw err;
    });
}

module.exports = closeFile;