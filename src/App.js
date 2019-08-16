import React, {Component} from 'react';
import "./style.css"
import { fbdatabase } from './api'

const query = fbdatabase.ref('contas');

const pagos = fbdatabase.ref('pagos');

const receber = fbdatabase.ref('receber');

class App extends Component {
  
  state = {
    contas: [],
    receber: [],
    add_despesa: false,
    value_gasto: '',
    value_valor: ''
  }

  componentDidMount() {
    
    query.on('value', snap => {
      const itens = snap.val();

      if (itens != null) {
        const values = Object.keys(itens).map(i => itens[i]);

        console.log(values)

        this.setState({ contas: values });
      }
    })

    receber.on('value', snap => {
      const itens = snap.val();

      if (itens != null) {
        const values = Object.keys(itens).map(i => itens[i]);

        console.log(values)

        this.setState({ receber: values });
      }
    })

  }

  _handleAddDispesa(){
    const ref = query;
    const id = ref.push().key;

    const valores = {
      id,
      gasto: this.state.value_gasto,
      valor: this.state.value_valor,
      paid: false
    }

    ref.child(id).set(valores, err => {
      if (err) {
        console.log(err)
      } else {
        this.setState({ 
          value_gasto: '',
          value_valor: ''
         })
      }
    })
  }

  _handlePagar(key, valor, gasto, paid) {
    
    const ref = pagos;
    const id = ref.push().key;

    const valores = {
      id,
      gasto: gasto,
      valor: valor,
      paid: !paid
    }

    ref.child(id).set(valores, err => {
      if (err) {
        console.log(err)
      }
    })

    query.child(key).remove()
  }

  render() {
    return (
      <div>
        <div className="row">
            <div className="col s12">
              <h4>Geral</h4>
            </div>
  
            <div className="row">
              <div className="col s12">
              <div className="col s4">
                  <div className="card darken-1">
                    <div className="card-content white-text">
                      <span style={{ color: 'black' }} className="card-title">Gráfico</span>
                    </div>
                  </div>
              </div>
  
              <div className="col s4">
                  <div className="card darken-1">
                    <span style={{ 
                      color: 'black',
                      marginLeft: '20px'
                     }} 
                    className="card-title">Gastos</span>

                    <div id="scrolling" className="card-content white-text">
                      
                      <table style={{ color: 'black' }}>
                        <tbody>
                          {
                            this.state.contas.map((dados, i) => (
                              <tr key={i}>
                                <td
                                  style={{color: 'red'}}
                                > 
                                  { dados.gasto } 
                                </td>
                                <td
                                  style={{ color: dados.valor >= 100 ? 'red' : 'black' }}
                                > 
                                  { dados.valor } 
                                </td>
                                <td>
                                  <i 
                                  onClick={
                                    () => 
                                    this._handlePagar(
                                      dados.id, 
                                      dados.valor,
                                      dados.gasto,
                                      dados.paid
                                      )
                                  }
                                  className="material-icons pagar">check</i>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
  
              <div className="col s4">
                <div className="card darken-1">
                  <div className="card-content white-text">
                    <div className="add_gasto">
                      <a 
                      onClick={
                        () => this.setState({ add_despesa: !this.state.add_despesa })
                      }
                      className="btn-floating btn-large waves-effect waves-light blue">
                        <i className="material-icons">add</i>
                      </a>
                      <span 
                      style=
                      {{ 
                        color: 'black',
                        marginTop: '10px',
                        marginLeft: '20px' 
                      }} 
                      className="card-title">
                        Nova despesa
                      </span>
                    </div>
  
                    <br />
  
                    <div className="add_gasto">
                      <a className="btn-floating btn-large waves-effect waves-light green">
                        <i className="material-icons">add</i>
                      </a>
                      <span 
                      style=
                      {{ 
                        color: 'black',
                        marginTop: '10px',
                        marginLeft: '20px' 
                      }} 
                      className="card-title">
                        Nova receita
                      </span>
                    </div>

                    <br />
                    {
                      this.state.add_despesa !== false ?
                      <div className="add_gasto">
                      <p style={{ color: 'black' }} >Informações da despesa</p>
                      <form className="col s12">
                        <div className="row">
                          <div className="input-field col s12">
                            <input 
                            value={ this.state.value_gasto }
                            onChange={
                              e => this.setState({ value_gasto: e.target.value })
                            }
                            id="input_text" type="text"></input>
                            <label>Gasto</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <input 
                            value={ this.state.value_valor }
                            onChange={
                              e => this.setState({ value_valor: e.target.value })
                            }
                            id="input_number" type="number"></input>
                            <label>Valor</label>
                          </div>
                        </div>
                        <button
                          onClick={() => this._handleAddDispesa()}
                          className="btn waves-effect waves-light blue" 
                          type="button" 
                          name="action">
                          Adicionar
                          <i className="material-icons right">send</i>
                        </button>
                      </form>
                    </div> : ''
                    }
                  </div>
                
                </div>

                {
                  this.state.add_despesa !== true ? 
                  <div className="card darken-1">
                    <span style={{ 
                      color: 'black',
                      marginLeft: '20px'
                     }} 
                    className="card-title">Receber</span>

                    <div id="scrolling_receber" className="card-content white-text">
                      
                      <table style={{ color: 'black' }}>
                        <tbody>
                          {
                            this.state.receber.map((dados, i) => (
                              <tr key={i}>
                                <td
                                  style={{color: 'red'}}
                                > 
                                  { dados.gasto } 
                                </td>
                                <td
                                  style={{ color: dados.valor >= 100 ? 'red' : 'black' }}
                                > 
                                  { dados.valor } 
                                </td>
                                <td>
                                  <i className="material-icons pagar">check</i>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div> : ''
                }

              </div>
              
              </div>
            </div>
  
          </div>
      </div>
    );
  }
}

export default App;
