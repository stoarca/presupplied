import express from 'express';
import fs from 'node:fs/promises';
import path from 'path';

import { typedPost } from '../typedRoutes';

const ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60;

const roundToPreviousDay = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export const setupTrainingRoutes = (router: express.Router) => {
  typedPost(router, '/api/training/events', async (req, resp, next) => {
    const date = parseInt(req.body.id.split('-')[0]);
    if (Date.now() - date > ONE_HOUR_IN_MILLISECONDS) {
      return resp.status(410).json({
        errorCode: 'training.events.tooLate',
        message: 'The request was sent too late',
      });
    }

    const previousDay = roundToPreviousDay(date);
    const dir = path.join('/training_data/', previousDay.toString(), req.body.id);
    await fs.mkdir(dir, {recursive: true});
    const seqId = req.body.sequenceId.toString().padStart(4, '0');

    const wavChunk = new Buffer(req.body.webmSoundB64, 'base64');
    await fs.writeFile(
      path.join(dir, seqId + '.webmpart'),
      wavChunk
    );
    await fs.writeFile(
      path.join(dir, seqId + '.chunks'),
      JSON.stringify(req.body.events, undefined, 2)
    );

    return resp.json({success: true});
  });
};