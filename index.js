const express = require('express')
const app = express()
require('dotenv').config()


app.use(express.json());

const path = require('path');
const fs = require('fs').promises;

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
  

async function main(ext) {
    const inputPath = "demo"+ext;
    const ext_to = ".pdf"
    const outputPath = path.join(__dirname, `/newFile${ext_to}`);

    // Read file
    const docxBuf = await fs.readFile(inputPath);

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext_to, undefined);

    // Here in done you have pdf file which you can save or transfer in another stream
    await fs.writeFile(outputPath, pdfBuf);
}

function get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}


app.post("/gen_pdf", (req, res) => {

   
    if(!req?.body?.file_url){
        return res.send("*Please send file url!");
    }

    req.body.file_url = decodeURIComponent(req?.body?.file_url);

    const ext = get_url_extension(req?.body?.file_url);
    
    if(!ext){
        return res.send("*Please file extension is required!");
    }

    const http = require('https'); // or 'https' for https:// URLs
    const fs = require('fs');

    const file = fs.createWriteStream("demo."+ext);
    const request = http.get(req.body.file_url, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            main("."+ext).then(()=>{
                res.sendFile(path.join(__dirname, `/newFile.pdf`));
                // fs.unlink(path.join(__dirname, "/demo."+ext));

            }).catch(function (err) {
                console.log(`Error converting file: ${err}`);
            })
        });
    });

});

app.get("/",(req,res)=>res.send("Welcome to website"));

app.listen(process.env.PORT, () => {
    console.log("Server is running on 2023")
})