module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Find the ModuleBuilder export default statement
  const exportDefault = root.find(j.ExportDefaultDeclaration);

  // Add React import if it's not already present
  if (!root.find(j.ImportDeclaration, { source: { value: 'react' } }).size()) {
    root.find(j.ImportDeclaration).at(0).insertBefore(
      j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier('React'))], j.literal('react')
      )
    );
  }


  // Extract array elements from ModuleBuilder variants property
  let elements = [];
  exportDefault.find(j.ObjectExpression).forEach(path => {
    path.node.properties.forEach(property => {
      if (
        property.key.name === 'variants' &&
        property.value.type === 'ArrayExpression'
      ) {
        elements = property.value.elements;
      }
    });
  });

  // Create a new variable declaration for the words array
  const wordsArray = j.exportNamedDeclaration(j.variableDeclaration('let', [
    j.variableDeclarator(j.identifier('words'), j.arrayExpression(elements))
  ]));

  // Replace the default export with the new function returning JSX
  exportDefault.replaceWith(
    j.exportDefaultDeclaration(
      j.arrowFunctionExpression(
        [j.identifier.from({
          name: 'props',
          typeAnnotation: j.tsTypeAnnotation(j.tsNeverKeyword()),
        })],
        j.blockStatement([
          j.returnStatement(
            j.jsxElement(
              j.jsxOpeningElement(j.jsxIdentifier('ModuleBuilder'), [
                j.jsxAttribute(
                  j.jsxIdentifier('variants'),
                  j.jsxExpressionContainer(j.identifier('words'))
                )
              ], true),
              null,
              [],
              true
            )
          )
        ])
      )
    )
  );

  // Insert the new words array before the export
  exportDefault.insertBefore(wordsArray);

  return root.toSource({
    quote: 'single',
    tabWidth: 2,
  });
};
