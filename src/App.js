  import React, {Component} from 'react';
  import "./style.css"
  import { fbdatabase } from './api'
  import Receber from './components/receber/receber'
  import moment from 'moment';
  import { Modal, Tabs, Tab } from 'react-materialize';
  import LoadingGastos from './components/loading/loader'
  import LoadingPagos from './components/loading/loaderPagos'

  const query = fbdatabase.ref('contas');

  const query_pagos = fbdatabase.ref('pagos');

  const query_receber = fbdatabase.ref('receber');

  class App extends Component {

    state = {
      contas: [],
      receber: [],
      pagos: [],

      add_despesa: false,
      value_gasto: '',
      value_valor: '',

      value_pessoa: '',
      value_dinheiro: '',

      l_gastos: true,
      msg_gastos: '',

      l_pagos: true,
      msg_pagos: '',

      l_receber: true,
      msg_receber: ''
    }

    componentDidMount() {

      query.on('value', snap => {
        const itens = snap.val();

        if (itens != null) {
          const contas = Object.keys(itens).map(i => itens[i]);

          this.setState({ contas, l_gastos: false, msg_gastos: '' });
        }

        if (itens == null) {
          this.setState({ l_gastos: false, msg_gastos: 'Nenhum item encontrado.' });
        }

      })

      query_pagos.on('value', snap => {
        const itens = snap.val();

        if (itens != null) {
          const pagos = Object.keys(itens).map(i => itens[i]);

          this.setState({ pagos, l_pagos: false,  msg_pagos: '' });
        }

        if (itens == null) {
          this.setState({ l_pagos: false, msg_pagos: 'Nenhum item encontrado.' });
        }
      })

      query_receber.on('value', snap => {
        const itens = snap.val();

        if (itens != null) {
          const receber = Object.keys(itens).map(i => itens[i]);

          this.setState({ receber, l_receber: false, msg_receber: '' });
        }

        if (itens == null) {
          this.setState({ l_receber: false, msg_receber: 'Nenhum item encontrado.' });
        }
      })
    }

    _handleAddDispesa(){
      const ref = query;
      const id = ref.push().key;

      const { value_gasto } = this.state;
      const { value_valor} = this.state;

      const m = moment().format('L');

      const d = m.split('/');

      const newDate = `${d[1]}/${d[0]}/${d[2]}`

      if (value_gasto && value_valor !== null) {
        const valores = {
          id,
          gasto: this.state.value_gasto,
          valor: this.state.value_valor,
          paid: false,
          data: newDate
        }

        ref.child(id).set(valores, err => {
          if (err) {
            console.log(err)
          } else {
            this.setState({
              value_gasto: '',
              value_valor: '',
              add_despesa: false
             })
          }
        })
      } else {

      }
    }

    _handleAddDivida(){
      const ref = query_receber;
      const id = ref.push().key;

      const { value_pessoa } = this.state;
      const { value_dinheiro } = this.state;

      const m = moment().format('L');

      const d = m.split('/');

      const newDate = `${d[1]}/${d[0]}/${d[2]}`

      if (value_pessoa && value_dinheiro !== null) {
        const valores = {
          id,
          pessoa: this.state.value_pessoa,
          valor: this.state.value_dinheiro,
          paid: false,
          date: moment().format()
        }

        ref.child(id).set(valores, err => {
          if (err) {
            console.log(err)
          } else {
            this.setState({
              value_pessoa: '',
              value_dinheiro: ''
             })
          }
        })
      } else {

      }
    }



    _handlePagar(key, valor, gasto, paid) {

      const ref = query_pagos;
      const id = ref.push().key;

      const { contas } = this.state;

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

      if (contas.length === 1) {
        this.setState({ contas: [] })
      }

      query.child(key).remove()
    }

    _handleApagar(key) {

      const { pagos } = this.state;

      if (pagos.length === 1) {
        this.setState({ pagos: [] })
      }

      const ref = query_pagos;

      ref.child(key).remove()
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
                  <Tabs className="tab-demo z-depth-1">
                      <Tab title="Gastos" active>
                      <span style={{
                        color: 'black',
                        marginLeft: '20px'
                       }}
                      className="card-title">Gastos</span>

                      <div id="scrolling" className="card-content white-text">
                        
                        { 
                          this.state.l_gastos === true ? 
                          <LoadingGastos /> : <p style={{ color: 'black' }}> { this.state.msg_gastos } </p> 
                          }

                        <table style={{ color: 'black' }}>
                          <tbody>
                            {
                              this.state.contas.map((dados, i) => (
                                <tr key={i}>
                                  <td>
                                    <i
                                      style={{ color: 'red' }}
                                      className="material-icons">
                                      thumb_down
                                    </i>
                                  </td>
                                  <td
                                    style={{color: 'red'}}
                                  >
                                    { dados.gasto } <br />
                                    { dados.data }
                                  </td>
                                  <td
                                    style={{ color: dados.valor >= 100 ? 'red' : 'black' }}
                                  >
                                  R$  { dados.valor }
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
                      </Tab>


                      <Tab title="Pagos">
                      <span style={{
                        color: 'black',
                        marginLeft: '20px'
                       }}
                      className="card-title">Pagos</span>

                      <div id="scrolling" className="card-content white-text">

                      { 
                        this.state.l_pagos === true ? 
                        <LoadingPagos /> : <p style={{ color: 'black' }}> { this.state.msg_pagos } </p> 
                        }

                        <table style={{ color: 'black' }}>
                          <tbody>
                            {
                              this.state.pagos.map((dados, i) => (
                                <tr key={i}>
                                  <td>
                                      <i style={{ color: '#4DD97C' }}
                                        className="material-icons">
                                        thumb_up
                                      </i>
                                  </td>
                                  <td
                                    style={{color: '#4DD97C'}}
                                  >
                                    { dados.gasto } <br />
                                    { dados.data }
                                  </td>
                                  <td
                                    style={{ color: dados.valor >= 100 ? '#4DD97C' : 'black' }}
                                  >
                                  R$  { dados.valor }
                                  </td>
                                  <td>
                                    <i
                                    onClick={
                                      () =>
                                      this._handleApagar( dados.id )
                                    }
                                    className="material-icons pago">close</i>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                      </Tab>
                  </Tabs>
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
                              required
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
                              required
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
                            Adicionar despesa
                            <i className="material-icons right">send</i>
                          </button>
                        </form>
                      </div> : ''
                      }
                    </div>

                  </div>



                  {
                    this.state.add_despesa !== true ?
                    <div>
                        <ul className="collection">
                          <li className="collection-item">
                            A receber
                            <br />
                            <br />
                        <a href="#modal" className="modal-trigger btn-floating btn-large waves-effect waves-light red">
                            <i className="material-icons">add</i>
                        </a>  <span> Nova divida </span>

                        <Modal id="modal" header="Informações da divida">
                        <br />
                        <div className="input-field">
                          <input
                          required
                          value={ this.state.value_pessoa }
                          onChange={e => this.setState({ value_pessoa: e.target.value })}
                          id="input_text" type="text"></input>
                          <label>Devedor</label>
                        </div>
                        <div className="input-field">
                          <input
                          value={ this.state.value_dinheiro }
                          required
                          onChange={e => this.setState({ value_dinheiro: e.target.value })}
                          id="input_number" type="number"></input>
                          <label>Valor</label>
                        </div>

                        <button
                            onClick={() => this._handleAddDivida()}
                            className="btn waves-effect waves-light red"
                            type="button"
                            name="action">
                            Adicionar divida
                            <i className="material-icons right">send</i>
                          </button>

                        </Modal>
                        <br />
                        <Receber dados={this.state} />
                          </li>
                        </ul>
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
