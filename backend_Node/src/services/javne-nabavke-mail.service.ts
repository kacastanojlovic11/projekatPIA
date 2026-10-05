import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function posaljiObavjestenjeStamparijama(stamparije: any[], javnaNabavka: any) {

    let proizvodiTekst = "";
    for (let stavka of javnaNabavka.stavke) {
        proizvodiTekst += "- " + stavka.nazivProizvoda + ", količina: " + stavka.kolicina + "\n";
    }

    const tekst = "Otvorena je nova javna nabavka.\n\n" + "ID javne nabavke: " + javnaNabavka._id + "\n\n" + "Institucija: " + javnaNabavka.nazivInstitucije + "\n\n" + "Potrebni proizvodi:\n" + proizvodiTekst + "\n" + "Licitacija traje do: " + new Date(javnaNabavka.datumIsteka).toLocaleString("sr-RS");

    for ( let stamparija of stamparije) {
        if (!stamparija.mejl) continue;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: stamparija.mejl,
            subject: "Nova javna nabavka - Printing House",
            text: tekst
        });
    }
}