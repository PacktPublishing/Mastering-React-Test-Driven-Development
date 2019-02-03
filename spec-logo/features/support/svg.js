import expect from 'expect';

export const checkLinesFromDataTable = page =>
  async function(dataTable) {
    await this.waitForAnimationToEnd(page);
    const lines = await this.getPage(page).$$eval('line', lines =>
      lines.map(line => ({
        x1: parseFloat(line.getAttribute('x1')),
        y1: parseFloat(line.getAttribute('y1')),
        x2: parseFloat(line.getAttribute('x2')),
        y2: parseFloat(line.getAttribute('y2'))
      }))
    );
    for (let i = 0; i < lines.length; ++i) {
      expect(lines[i].x1).toBeCloseTo(
        parseInt(dataTable.hashes()[i].x1)
      );
      expect(lines[i].y1).toBeCloseTo(
        parseInt(dataTable.hashes()[i].y1)
      );
      expect(lines[i].x2).toBeCloseTo(
        parseInt(dataTable.hashes()[i].x2)
      );
      expect(lines[i].y2).toBeCloseTo(
        parseInt(dataTable.hashes()[i].y2)
      );
    }
  };
