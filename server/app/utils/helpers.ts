/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import puppeteer from "puppeteer";

export const electronicUrl = "https://www.wheystore.vn/";
export const craw = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(electronicUrl);

  const electronicData = await page.evaluate(() => {
    const products: any[] = [];
    const product_wrapper = document.querySelectorAll(".product");
    product_wrapper.forEach((product) => {
      const dataJson: {
        title?: string;
        price?: string;
      } = {};
      try {
        if (product) {
          dataJson.title = (
            product.querySelector(".lazy") as HTMLIFrameElement
          ).src;

          dataJson.price = product.querySelector(".price .old")
            ?.textContent as string;
        }
      } catch (err) {
        console.log(err);
      }
      products.push(dataJson);
    });
    return products;
  });

  console.log(electronicData);
  await browser.close();
};
