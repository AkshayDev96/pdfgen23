const express = require('express')
const app = express()
require('dotenv').config()


app.use(express.json());

const path = require('path');
const fs = require('fs').promises;
const { convertWordFiles } = require('convert-multiple-files-ul')
// const libre = require('libreoffice-convert');
// const { spawn } = require('child_process');
// libre.convertAsync = require('util').promisify(libre.convert);


async function main(ext) {
    const inputPath = "demo" + ext;
    const ext_to = ".pdf"
    const outputPath = path.join(__dirname, `/newFile${ext_to}`);

    // Read file
    const docxBuf = await fs.readFile(inputPath);

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext_to, undefined);

    // Here in done you have pdf file which you can save or transfer in another stream
    await fs.writeFile(outputPath, pdfBuf);
}

function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}


app.post("/gen_word_to_pdf", (req, res) => {


    if (!req?.body?.file_url) {
        return res.send("*Please send file url!");
    }

    req.body.file_url = decodeURIComponent(req?.body?.file_url);

    const ext = get_url_extension(req?.body?.file_url);

    if (!ext) {
        return res.send("*Please file extension is required!");
    }

    const http = require('https'); // or 'https' for https:// URLs
    const fs = require('fs');

    const file = fs.createWriteStream("demo." + ext);
    const request = http.get(req.body.file_url, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", async () => {
            file.close();
            console.log('demo.' + ext)
            await convertWordFiles(path.resolve(__dirname, 'demo.' + ext), 'pdf', path.resolve(__dirname));
            // main("."+ext).then(()=>{
            res.sendFile(path.join(__dirname, `/demo.pdf`));
            // fs.unlink(path.join(__dirname, "/demo."+ext));

            // }).catch(function (err) {
            //     console.log(`Error converting file: ${err}`);
            // })
        });
    });

});

app.post("/gen_word_to_any", (req, res) => {


    if (!req?.body?.file_url) {
        return res.send("*Please send file url!");
    }

    req.body.file_url = decodeURIComponent(req?.body?.file_url);

    const ext = get_url_extension(req?.body?.file_url);

    if (!ext) {
        return res.send("*Please file extension is required!");
    }

    const http = require('https'); // or 'https' for https:// URLs
    const fs = require('fs');

    const file = fs.createWriteStream("demo." + ext);
    const request = http.get(req.body.file_url, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", async () => {
            file.close();
            console.log('demo.' + ext)

            var toPdf = require("office-to-pdf")
            var wordBuffer = fs.readFileSync("./demo.xlsx")

            toPdf(wordBuffer).then(
                (pdfBuffer) => {
                    fs.writeFileSync("./demo.pdf", pdfBuffer)
                    res.sendFile(path.join(__dirname, `/demo.pdf`));
                }, (err) => {
                    console.log(err)
                }
            )
            //  await convertWordFiles(path.resolve(__dirname, 'demo.'+ext), 'pdf', path.resolve(__dirname));
            // main("."+ext).then(()=>{
           
            // fs.unlink(path.join(__dirname, "/demo."+ext));

            // }).catch(function (err) {
            //     console.log(`Error converting file: ${err}`);
            // })
        });
    });

});

const office = require('node-convert')


app.get("/", async (req, res) => {
    res.send("Welcome to website")
    try {
        //   await office.convert('demo.docx', 'test.pdf', ()=>console.log('Done!'));
        const x = await office.convert(path.join(__dirname, `/demo.docx`), 'xxxxxx.pdf');
        // const buffer = await office.convert('./demo.docx');
        console.log(x)
    } catch (e) {
        console.log("Error--->", e)
    }
});



// const  test=async()=>{
//     // Return promise => convertWordFiles(path of the file to be converted, convertTo, outputDir)
//     const pathOutput = await convertWordFiles(path.resolve(__dirname, 'demo.docx'), 'pdf', path.resolve(__dirname));
//     console.log(pathOutput);
//   }



app.listen(2023,  () => {
    // try{
    //     test().then(()=>console.log("done")).catch((e)=>console.log(e))
    // }catch(e){
    //     console.log("Error--->",e)
    // }

    //    console.log(data)

    console.log("Server is running on !!!!!"+2023)
})
