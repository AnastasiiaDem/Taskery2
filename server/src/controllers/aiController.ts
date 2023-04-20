import express from 'express';

const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getAItext = async (req: express.Request, res: express.Response) => {
  try {
    const response = await openai.createCompletion({
      'model': 'text-davinci-003',
      'prompt': req.body.prompt,
      'max_tokens': 3000,
    });
    if (!response.data) return res.status(400).json({message: 'No content'});
    
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

export const getAIbudget = async (req: express.Request, res: express.Response) => {
  try {
    const response = await openai.createCompletion({
      'model': 'text-davinci-003',
      'prompt': req.body.prompt,
      'max_tokens': 3000,
    });
    if (!response.data) return res.status(400).json({message: 'No content'});
    
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};
