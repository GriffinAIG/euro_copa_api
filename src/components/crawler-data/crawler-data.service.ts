import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CrawlerDataService {

    async getFootballMatches() {
        try {
            // Khởi tạo Puppeteer
            const browser = await puppeteer.launch(
                { headless: true }
            );
            const page = await browser.newPage()

            await page.goto('https://bongda24h.vn/euro/lich-thi-dau-84.html', {
                waitUntil: 'networkidle2',
            });

            // Trích xuất tất cả các thẻ chứa class 'football-match'
            const matches = await page.$$eval('.football-match', elements => {
                return elements.map((element: any) => ({
                    text: element?.textContent,
                }))
            }
            );

            await browser.close();

            return matches;
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    }

}
