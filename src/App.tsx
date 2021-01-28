import React, { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';

function App() {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
  };

  useEffect(() => {
    startService();
  }, [])

  const transpileInputCode = async (input: string) => {

    const transpiled = await ref.current.transform(input, {
      loader: 'tsx',
      target: 'es2015'
    });

    setCode(transpiled.code);
  };

  return (
    <div>
      <h2>Lame, ugly but functional web transpiler!</h2>
      <textarea
        onChange={ e => {
          setInput(e.target.value);
          transpileInputCode(e.target.value);
         } }
        value={ input }
        name="inputCode"
        id="inputCode"
        cols={120} rows={10}></textarea>
      <input
        onClick={ () => transpileInputCode(input)}
        type="button"
        value="Transpile!"/>
      <pre id="transpiledCode">{ code }</pre>
    </div>
  );
}

export default App;
