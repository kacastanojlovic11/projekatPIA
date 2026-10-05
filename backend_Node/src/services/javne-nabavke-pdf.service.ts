import PDFDocument from 'pdfkit';
import path from 'path';

export function napraviIzvjestajJavneNabavke(nabavka: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({margin: 50});
            const dijelovi: Buffer[] = [];

            doc.on( "data", (chunk) => {
                    dijelovi.push(chunk);
                }
            );
            doc.on( "end", () => {
                resolve(Buffer.concat(dijelovi));
            });
            doc.on("error", reject);
            const fontPath = path.join(process.cwd(), "fonts", "DejaVuSans.ttf");
            doc.font(fontPath);
            doc.fontSize(18).text("Izvještaj o javnoj nabavci", { align: "center" });
            doc.moveDown();
            doc.fontSize(11).text( "ID javne nabavke: " + nabavka._id);
            doc.text("Institucija: " + nabavka.nazivInstitucije);
            doc.text("Datum raspisivanja: " + new Date(nabavka.datumRaspisivanja).toLocaleString("sr-RS"));
            doc.text("Datum završetka: " + new Date(nabavka.datumIsteka).toLocaleString("sr-RS"));
            doc.moveDown();
            doc.fontSize(14).text("Traženi proizvodi");
            doc.moveDown(0.5);
            let redniBroj = 1;
            for (let stavka of nabavka.stavke) {
                doc.fontSize(10).text(redniBroj + ". " + stavka.nazivProizvoda + " - količina: " + stavka.kolicina);
                doc.text("   Kategorija: " + stavka.kategorija + " / " + stavka.potkategorija);
                redniBroj++;
            }
            doc.moveDown();
            doc.fontSize(14).text("Pristigle ponude");
            doc.moveDown(0.5);
            if (!nabavka.ponude || nabavka.ponude.length === 0) {
                doc.fontSize(10).text("Nije pristigla nijedna ponuda.");
            } else {
                let brojPonude = 1;
                for (let ponuda of nabavka.ponude) {
                    doc.fontSize(11).text("Ponuda " + brojPonude + ": " + ponuda.nazivStamparije);
                    for (let stavka of ponuda.stavke) {
                        doc.fontSize(9).text("   " + stavka.nazivProizvoda + " - " + stavka.kolicina + " x " + stavka.jedinicnaCena + " RSD = " + stavka.ukupnaCena +  " RSD" );
                    }
                    doc.fontSize(10).text( "Ukupno: " + ponuda.ukupanIznos + " RSD");
                    doc.moveDown(0.5);
                    brojPonude++;
                }
            }
            doc.moveDown();
            doc.fontSize(14).text("Rezultat javne nabavke");
            doc.moveDown(0.5);
            if (nabavka.pobjednickaStamparijaId && nabavka.pobjednickaPonuda != null) {
                const pobjednik = nabavka.ponude.find((p: any) =>
                    p.stamparijaId === nabavka.pobjednickaStamparijaId
                );
                doc.fontSize(11).text( "Pobjednička štamparija: " + ( pobjednik ? pobjednik.nazivStamparije : nabavka.pobjednickaStamparijaId));
                doc.text("Pobjednička ponuda: " + nabavka.pobjednickaPonuda + " RSD");
            } else {
                doc.fontSize(11).text("Javna nabavka nema pobjedničku ponudu.");
            }
            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}