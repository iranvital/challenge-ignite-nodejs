import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
});

async function ImportCsv() {
  const linesParse = stream.pipe(csvParse);
  let count = 0;

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })

    count++
    console.log(`Imported ${count} tasks`)

    await wait(1000)
  }

  console.log('Import finished')

}

ImportCsv()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}