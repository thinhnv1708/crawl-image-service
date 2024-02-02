import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { ICrawlImageBody, crawlImageBodyJoiSchema } from './dtos';

@Controller('/api/v1/crawl-image')
export class CrawlerRestControllerAdp {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('/')
  async crawlImage(
    @Body() body: ICrawlImageBody,
  ): Promise<{ fileName: string }> {
    const { error, value } = crawlImageBodyJoiSchema.validate(body);

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { source, category, fileType, width, height } =
      value as ICrawlImageBody;
    const fileName = await this.crawlerService.getFileImageName(
      source,
      category,
      fileType,
      width,
      height,
    );

    return { fileName };
  }
}
