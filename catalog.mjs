// Fictional demonstration options, not verified inventory or specifications.
const groups = [
 ['Commercial Fryers',[
  ['Single-Tank Gas Fryer','Single-tank fryer','Gas','Restaurant frying'],
  ['Double-Tank Gas Fryer','Double-tank fryer','Gas','Restaurant and fast-food frying'],
  ['Electric Deep Fryer','Deep fryer','Electric','Cafe and commercial frying'],
  ['Countertop Fryer','Countertop fryer','To be confirmed','Compact food preparation']]],
 ['Cooking Equipment',[
  ['Commercial Gas Range','Gas range','Gas','Restaurant cooking'],
  ['Industrial Cooking Burner','Cooking burner','Gas','Commercial cooking'],
  ['Commercial Griddle','Griddle','To be confirmed','Burgers and grilled snacks'],
  ['Hot Plate','Hot plate','To be confirmed','Cafe cooking'],
  ['Shawarma Machine','Shawarma machine','To be confirmed','Shawarma preparation']]],
 ['Baking Equipment',[
  ['Commercial Baking Oven','Baking oven','To be confirmed','Bakery preparation'],
  ['Pizza Oven','Pizza oven','To be confirmed','Pizza preparation'],
  ['Convection Oven','Convection oven','To be confirmed','Bakery and cafe preparation'],
  ['Dough Mixer','Dough mixer','Not applicable','Dough preparation']]],
 ['Refrigeration',[
  ['Commercial Refrigerator','Refrigerator','Electric','Commercial food storage'],
  ['Commercial Freezer','Freezer','Electric','Frozen food storage'],
  ['Stainless Steel Chiller','Chiller','Electric','Commercial food storage'],
  ['Display Refrigerator','Display refrigerator','Electric','Cafe and bakery display']]],
 ['Food Preparation',[
  ['Vegetable Cutter','Vegetable cutter','To be confirmed','Vegetable preparation'],
  ['Meat Mincer','Meat mincer','To be confirmed','Meat preparation'],
  ['Stainless Steel Preparation Table','Preparation table','Not applicable','Commercial food preparation']]],
 ['Washing & Kitchen Setup',[
  ['Commercial Sink','Sink unit','Not applicable','Commercial washing'],
  ['Stainless Steel Work Table','Work table','Not applicable','Commercial kitchen work area'],
  ['Exhaust Hood','Exhaust hood','To be confirmed','Kitchen ventilation'],
  ['Kitchen Ventilation Equipment','Ventilation equipment','To be confirmed','Commercial kitchen ventilation']]],
 ['Food Holding', [['Commercial Food Warmer','Food warmer','To be confirmed','Commercial food holding']]]
];
export const catalog=groups.flatMap(([category,products])=>products.map(([name,type,fuelType,typicalUseCase])=>({
 id:'PKE-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), category,name,type,fuelType,
 sizeCategory:'To be confirmed',typicalUseCase,
 description:`Fictional ${type.toLowerCase()} option for ${typicalUseCase.toLowerCase()}.`,
 qualificationQuestions:category==='Commercial Fryers'?['What will you use it for?','Gas or electric, or not decided?','Single tank, double tank or countertop?']:['What will you use it for?','Any important preferences?'],
 availability:'To be confirmed',fictional:true
})));
