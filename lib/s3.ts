import AWS from 'aws-sdk';



// Endpoint is in DigitalOcean
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT || '');

export const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_ACCESS,
    secretAccessKey: process.env.SPACES_SECRET,
});

