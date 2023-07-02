import express from 'express';

const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getAIProject = async (req: express.Request, res: express.Response) => {
  try {
    const response = await openai.createChatCompletion({
      'model': 'gpt-3.5-turbo',
      messages: [
        {'role': 'system', 'content': 'You are a helpful assistant that generate project description from title.'},
        {'role': 'user', 'content': req.body.prompt}
      ]
    });
    // const response = await openai.createChatCompletion({
    //   'model': 'gpt-3.5-turbo',
    //   'prompt': req.body.prompt,
    //   'max_tokens': 5000,
    // });

    if (!response.data) return res.status(400).json({message: 'No content'});

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

export const getAIBudget = async (req: express.Request, res: express.Response) => {
  try {
    const response = await openai.createChatCompletion({
      'model': 'gpt-3.5-turbo',
      messages: [
        {
          'role': 'system',
          'content': 'You are a helpful assistant that generate the minimum cost of the project per month, including salaries and technical expenses, based on the number of employees, project name and description. YOUR RESPOND HAVE TO CONTAIN ONLY ONE NUMBER WITHOUT TEXT.'
        },
        {'role': 'user', 'content': req.body.prompt}
      ]
    });
    // const response = await openai.createChatCompletion({
    //   'model': 'gpt-3.5-turbo',
    //   'prompt': req.body.prompt,
    //   'max_tokens': 5000,
    // });

    if (!response.data) return res.status(400).json({message: 'No content'});

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

export const getAITask = async (req: express.Request, res: express.Response) => {
  try {
    const response = await openai.createChatCompletion({
      'model': 'gpt-3.5-turbo',
      messages: [
        {
          'role': 'system',
          'content': 'You are a helpful assistant that generate task description from title and project name.'
        },
        {'role': 'user', 'content': req.body.prompt}
      ]
    });
    // const response = await openai.createChatCompletion({
    //   'model': 'gpt-3.5-turbo',
    //   'prompt': req.body.prompt,
    //   'max_tokens': 5000,
    // });

    if (!response.data) return res.status(400).json({message: 'No content'});

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};
