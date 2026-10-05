import PDFDocument = require('pdfkit');
import nodemailer = require('nodemailer');
import path = require('path');

function napraviPdf(narudzbina: any): Promise<Buffer> {

    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({margin: 50});
        const fontPath = path.join(process.cwd(), "fonts", "DejaVuSans.ttf");
        doc.font(fontPath);

        const dijelovi: Buffer[] = [];

        doc.on('data', (dio) => { dijelovi.push(dio);});

        doc.on('end', () => {resolve(Buffer.concat(dijelovi));});
        doc.on('error', (err) => {reject(err);});
        doc.fontSize(20).text("FAKTURA", {align: "center"});
        doc.moveDown();
        doc.fontSize(12).text("ID fakture: " + narudzbina._id);
        doc.text("Stamparija: " + narudzbina.nazivStamparije);
        doc.text("Grad: " + narudzbina.grad);
        doc.text("Datum: " + new Date(narudzbina.datumNarucivanja).toLocaleString());
        doc.moveDown();
        doc.fontSize(14).text("Proizvodi:");
        doc.moveDown(0.5);
        let redniBroj = 1;
        for (let stavka of narudzbina.stavke) {
            doc.fontSize(11).text(redniBroj + ". " + stavka.nazivProizvoda);
            doc.text("Kolicina: " + stavka.kolicina);
            doc.text("Boja: " + stavka.boja);
            doc.text("Tip stampe: " + stavka.tipStampe);
            doc.text("Cijena proizvoda: " + stavka.jedinicnaCena + " RSD");
            doc.text("Dodatna cijena stampe: " + stavka.dodatnaCenaPoKomadu + " RSD");
            doc.text("Ukupno za stavku: " + stavka.ukupnaCena + " RSD" );
            doc.moveDown();
            redniBroj++;
        }

        doc.moveDown();
        doc.fontSize(14).text( "UKUPAN IZNOS: " + narudzbina.ukupanIznos + " RSD" );
        doc.end();
    });
}


export async function posaljiFakture(email: string, narudzbine: any[]) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        throw new Error( "Email podaci nisu podešeni." );
    }

    const transporter =
        nodemailer.createTransport({
            service: "gmail",
            auth: { user: emailUser, pass: emailPass}
        });

    const prilozi = [];

    for (let narudzbina of narudzbine) {
        const pdf = await napraviPdf(narudzbina);
        prilozi.push({filename: "faktura_" + narudzbina._id + ".pdf", content: pdf});
    }

    await transporter.sendMail({
        from: emailUser,
        to: email,
        subject: "Printing House - faktura",
        text: "U prilogu se nalaze fakture za Vašu narudžbinu.",
        attachments: prilozi
    });
}