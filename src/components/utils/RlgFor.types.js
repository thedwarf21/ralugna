/**
 * @typedef LoopData
 * @property {string} itemName
 * @property {string} operator
 * @property {string} dataPath
 * @property {BindingParser} vmParser 
 */

/**
 * @typedef LooperData
 * @extends LoopData
 * @property {ObservableValue} pathTarget
 * @property {HTMLDivElement} patternNode
 * @property {string} parentTagName
 */