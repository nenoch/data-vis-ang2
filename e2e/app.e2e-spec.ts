import { D3AngProjectPage } from './app.po';

describe('d3-ang-project App', () => {
  let page: D3AngProjectPage;

  beforeEach(() => {
    page = new D3AngProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
