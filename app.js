const fs = require("fs");
const ZipNode = require("node-zip");
const axios = require("axios");
const qs = require("qs")
async function main() {
	const response = await axios
		.get(
			"https://api.mercadolibre.com/shipment_labels?shipment_ids=42098996036&savePdf=Y",
			{
				headers: {
					Authorization: `Bearer APP_USR-2189962971708303-030808-43da02cdba67d6ab61c104693e9e5f96-151197075`,
				},
				responseType: "arraybuffer",
			},
		)
		.then(async (res) => {
			return new ZipNode(res.data, {
				base64: false,
				checkCRC32: true,
			}).files["Etiqueta de envio.txt"]._data;
            
        });

    const pdf = await axios
        .post(
            "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
            response,
            { headers: { Accept: "application/pdf", 'content-type': 'application/x-www-form-urlencoded' } },
        )
        .then((result) => {
            
            var filename = "label.pdf"; // change file name for PNG images
            fs.writeFile(filename, result.data, function (err) {
            	if (err) {
            		console.log(err);
                }
                console.log("done");
            });
        }).catch((err) => { 
            console.log(err.message);
        });
}
main();
