import NodeCache from 'node-cache';

const responseCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export default responseCache;