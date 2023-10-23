/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import puppeteer from "puppeteer";

export const electronicUrl = "https://gymstore.vn/whey-protein";
export const craw = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(electronicUrl);

  const gymstoreData = await page.evaluate(() => {
    const products: any[] = [];
    const product_wrapper = document.querySelectorAll(".product-col");
    product_wrapper.forEach((product) => {
      const dataJson: {
        name?: string;
        price?: string;
      } = {};
      try {
        if (product) {
          dataJson.name = (
            product.querySelector(".product-name") as HTMLHeadingElement
          ).innerText;

          dataJson.price = product.querySelector(".price")
            ?.textContent as string;
        }
      } catch (err) {
        console.log(err);
      }
      products.push(dataJson);
    });
    return products;
  });
  // const outputPath = path.join(__dirname, "product.json");
  // fs.writeFileSync(
  //   outputPath,
  //   JSON.stringify(
  //     {
  //       products: gymstoreData,
  //     },
  //     null,
  //     2
  //   )
  // );
  console.log(gymstoreData);
  await browser.close();
};
