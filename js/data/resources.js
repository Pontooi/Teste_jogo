// ============== LINKS DO W3SCHOOLS ==============
// page = capítulo em w3schools.com | q = busca no canal oficial do W3Schools no YouTube
const W3_BASE = 'https://www.w3schools.com/';
const W3_CHANNEL = 'https://www.youtube.com/@w3schools';
const W3_FULL_VIDEO = { html: 'https://youtu.be/BzYMFd-lQL4' };   // "HTML for Beginners" (linkado na página oficial do tutorial)
const W3_RESOURCES = {
  'html:estrutura':{page:'html/html_basic.asp',q:'HTML Basic'},
  'html:texto-links':{page:'html/html_links.asp',q:'HTML Links'},
  'html:imagens':{page:'html/html_images.asp',q:'HTML Images'},
  'html:tabelas-forms':{page:'html/html_tables.asp',q:'HTML Tables'},
  'html:semantica':{page:'html/html5_semantic_elements.asp',q:'HTML Semantic Elements'},
  'html:meta-seo':{page:'html/html_head.asp',q:'HTML Head'},
  'html:boas-praticas':{page:'html/html5_syntax.asp',q:'HTML Style Guide'},
  'css:seletores':{page:'css/css_selectors.asp',q:'CSS Selectors'},
  'css:cores-tipografia':{page:'css/css_colors.asp',q:'CSS Colors'},
  'css:display-position':{page:'css/css_display.asp',q:'CSS Display'},
  'css:flex':{page:'css/css3_flexbox.asp',q:'CSS Flexbox'},
  'css:grid':{page:'css/css_grid.asp',q:'CSS Grid'},
  'css:responsivo':{page:'css/css3_mediaqueries.asp',q:'CSS Media Queries'},
  'css:pseudo-classes':{page:'css/css_pseudo_classes.asp',q:'CSS Pseudo-classes'},
  'css:transicoes':{page:'css/css3_transitions.asp',q:'CSS Transitions'},
  'js:variaveis':{page:'js/js_variables.asp',q:'JavaScript Variables'},
  'js:condicionais':{page:'js/js_if_else.asp',q:'JavaScript If Else'},
  'js:funcoes':{page:'js/js_functions.asp',q:'JavaScript Functions'},
  'js:arrays-objetos':{page:'js/js_arrays.asp',q:'JavaScript Arrays'},
  'js:array-methods':{page:'js/js_array_methods.asp',q:'JavaScript Array Methods'},
  'js:dom':{page:'js/js_htmldom.asp',q:'JavaScript HTML DOM'},
  'js:storage':{page:'js/js_api_web_storage.asp',q:'JavaScript Web Storage'},
  'js:erros':{page:'js/js_errors.asp',q:'JavaScript Errors try catch'},
  'python:sintaxe':{page:'python/python_syntax.asp',q:'Python Syntax'},
  'python:controle':{page:'python/python_for_loops.asp',q:'Python For Loops'},
  'python:estruturas':{page:'python/python_lists.asp',q:'Python Lists'},
  'python:funcoes-py':{page:'python/python_functions.asp',q:'Python Functions'},
  'python:compreensao':{page:'python/python_lists_comprehension.asp',q:'Python List Comprehension'},
  'python:arquivos':{page:'python/python_file_handling.asp',q:'Python File Handling'},
  'python:classes-py':{page:'python/python_classes.asp',q:'Python Classes'},
  'java:classe-main':{page:'java/java_syntax.asp',q:'Java Syntax'},
  'java:controle-java':{page:'java/java_for_loop.asp',q:'Java For Loop'},
  'java:metodos':{page:'java/java_methods.asp',q:'Java Methods'},
  'java:arrays-java':{page:'java/java_arrays.asp',q:'Java Arrays'},
  'java:colecoes':{page:'java/java_arraylist.asp',q:'Java ArrayList'},
  'java:heranca':{page:'java/java_inheritance.asp',q:'Java Inheritance'},
  'java:poo':{page:'java/java_oop.asp',q:'Java OOP'}
};
function w3Links(trilha, id){
  const r = W3_RESOURCES[trilha+':'+id];
  if(!r) return '';
  const vid = W3_CHANNEL + '/search?query=' + encodeURIComponent(r.q);
  const full = W3_FULL_VIDEO[trilha] ? ` <a class="w3-link" href="${W3_FULL_VIDEO[trilha]}" target="_blank" rel="noopener">▶ Curso completo em vídeo</a>` : '';
  return `<div class="w3-links"><span>W3Schools:</span>
    <a class="w3-link" href="${W3_BASE+r.page}" target="_blank" rel="noopener">📖 Capítulo</a>
    <a class="w3-link" href="${vid}" target="_blank" rel="noopener">▶ Vídeos do canal</a>${full}</div>`;
}
