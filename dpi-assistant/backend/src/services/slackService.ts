import { WebClient } from '@slack/web-api';
import * as crypto from 'crypto';

export interface SlackFileInfo {
  id: string;
  name: string;
  mimetype: string;
  url_private_download: string;
  size: number;
}

export class SlackService {
  private client: WebClient;
  private signingSecret: string;

  constructor(botToken: string, signingSecret: string) {
    this.client = new WebClient(botToken);
    this.signingSecret = signingSecret;
  }

  /**
   * Verify that the request came from Slack
   */
  verifySlackRequest(
    requestSignature: string,
    requestTimestamp: string,
    requestBody: string
  ): boolean {
    // Prevent replay attacks
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - parseInt(requestTimestamp)) > 60 * 5) {
      console.warn('⚠️  Slack request timestamp too old');
      return false;
    }

    // Compute the signature
    const sigBasestring = `v0:${requestTimestamp}:${requestBody}`;
    const mySignature = 'v0=' + crypto
      .createHmac('sha256', this.signingSecret)
      .update(sigBasestring)
      .digest('hex');

    // Compare signatures using timing-safe comparison
    try {
      return crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(requestSignature, 'utf8')
      );
    } catch {
      return false;
    }
  }

  /**
   * Download a file from Slack
   */
  async downloadFile(fileUrl: string): Promise<Buffer> {
    try {
      // Use Slack Web API to download the file
      const response = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${this.client.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error downloading file from Slack:', error);
      throw error;
    }
  }

  /**
   * Post a message to a Slack channel
   */
  async postMessage(channel: string, text: string): Promise<void> {
    try {
      await this.client.chat.postMessage({
        channel,
        text,
      });
    } catch (error) {
      console.error('Error posting message to Slack:', error);
      throw error;
    }
  }

  /**
   * React to a message with an emoji
   */
  async addReaction(channel: string, timestamp: string, emoji: string): Promise<void> {
    try {
      await this.client.reactions.add({
        channel,
        timestamp,
        name: emoji,
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      const result = await this.client.files.info({
        file: fileId,
      });
      return result.file;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }
}
