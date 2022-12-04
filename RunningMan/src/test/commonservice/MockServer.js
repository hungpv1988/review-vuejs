import { setupServer } from 'msw/node';
import  handler  from './RestHandler';
 
 export function setupMockServerForFindCampaignRest()
 {
    const server = setupServer(...handler)
    server.events.on('request:start', (req) => {
      console.log('new request:', req.method, req.url.href)
    });
    server.events.on('request:match', (req) => {
      console.log('%s %s has a handler!', req.method, req.url.href)
    });
    // Start server before all tests
    beforeAll(() => server.listen({  onUnhandledRequest(req) {
      console.error(
        'Found an unhandled %s request to %s',
        req.method,
        req.url.href,
      )
    }}))

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());
    
    return server;
 }