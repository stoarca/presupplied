const fs = require('fs');
const path = require('path');

let wordsDir = path.join(__dirname, '../../images/psapp/client/src/modules/common/READING/words');

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Locate the export default statement
  const exportDefault = root.find(j.ExportDefaultDeclaration);

  // Find the object expression passed to ModuleBuilder function
  const objectExpr = exportDefault.find(j.ObjectExpression).get('properties', 0, 'value').value.elements;

  objectExpr.forEach(element => {
    const word = element.properties.find(p => p.key.name === 'word').value.value;
    const sounds = element.properties.find(p => p.key.name === 'sounds').value;
    const spoken = element.properties.find(p => p.key.name === 'spoken').value;

    // Create the AST for each file
    const ast = j.objectExpression([
      j.property('init', j.identifier('word'), j.literal(word)),
      j.property('init', j.identifier('sounds'), sounds),
      j.property('init', j.identifier('spoken'), spoken)
    ]);

    const importStatement = j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier(`${word}Word`))],
      j.literal(`./${word}.wav`)
    );

    const exportStatement = j.exportDefaultDeclaration(
      j.tsAsExpression(ast, j.tsTypeReference(j.identifier('const')))
    );

    const newFileContent = j([importStatement, exportStatement]).toSource({
      quote: 'single',
      tabWidth: 2,
    });
    let wordFile = path.join(wordsDir, `${word}.ts`);
    fs.writeFileSync(wordFile, newFileContent.join('\n'));
  });

  const imports = root
      .find(j.ImportDeclaration)
      .filter(p => p.node.source.value.endsWith('.wav'))
      .forEach(p => p.node.source.value = '@src/modules/common/READING/words/' + p.node.source.value.substring(2, p.node.source.value.length - 4))

  const variantsArray = exportDefault.find(j.ObjectExpression).get('properties', 0, 'value').node;
  variantsArray.elements = variantsArray.elements.map((p) => {
    const spoken = p.properties.find(p => p.key.name === 'spoken').value;
    return spoken;
  });
  return root.toSource({
    quote: 'single',
    tabWidth: 2,
  });
};

module.exports.parser = 'tsx';
