  import React, {Component} from 'react';
  import "./style.css"
  import { fbdatabase } from './api'
  import Receber from './components/receber/receber'
  import { Line } from 'react-chartjs-2';
  import moment from 'moment';
  import { Modal, Tabs, Tab, Footer, Navbar, NavItem } from 'react-materialize';
  import LoadingGastos from './components/loading/loader'
  import LoadingPagos from './components/loading/loaderPagos'

  const UID = localStorage.getItem('u:money');

  const query = fbdatabase.ref(`${UID}/contas`);

  const query_pagos = fbdatabase.ref(`${UID}/pagos`);

  const query_receber = fbdatabase.ref(`${UID}/receber`);

  class App extends Component {

    state = {
      contas: [],
      receber: [],
      pagos: [],

      soma: [],
      soma_receber: [],
      soma_pagos: [],

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
      msg_receber: '',

      chartData: { }
    }

    componentDidMount() {

      // eslint-disable-next-line no-restricted-globals

      //QUERY DOS GASTOS

      query.on('value', snap => {
        const itens = snap.val();

        if (itens != null) {
          const contas = Object.keys(itens).map(i => itens[i]);

          let total = [];

          total = contas.map(d => (
            d.valor
          )) 

          let t = total.reduce((to, numero) => {
            return parseFloat(to)  + parseFloat(numero);
          }, 0)

           let labels = [];
           let data = [];


          for (let i = 0; i < contas.length; i++) {
            
            labels.push(contas[i].data);

            data.push(parseFloat(contas[i].valor));

            console.log(contas[i])
            
          }

          this.setState({ 
            contas, 
            soma: t,
            l_gastos: false, 
            msg_gastos: '',
            chartData: {
              labels: labels  ,
              datasets: [
                {
                    label: 'Gastos',
                    data,
                    backgroundColor: [ 'rgba(255, 99, 132, 0.2)', ]
                }
              ]
            }
          });
        }

        if (itens == null) {
          this.setState({ 
            l_gastos: false, 
            msg_gastos: 'Nenhum item encontrado.',
            contas: [],
            soma: [],
            chartData: {
              labels: []  ,
              datasets: []
            }
          });
        }

      })

      //QUERY DOS PAGOS

      query_pagos.on('value', snap => {
        const itens = snap.val();

        if (itens != null) {
          const pagos = Object.keys(itens).map(i => itens[i]);

          let total_pagos = [];

          total_pagos = pagos.map(d => (
            d.valor
          )) 

          let t_pagos = total_pagos.reduce((to, numero) => {
            return parseFloat(to)  + parseFloat(numero);
          }, 0)


          this.setState({ 
            pagos, 
            soma_pagos: t_pagos,
            l_pagos: false,  
            msg_pagos: ''
          });

        }

        if (itens == null) {
          this.setState({ 
            l_pagos: false, 
            msg_pagos: 'Nenhum item encontrado.',
            pagos: [],
            soma_pagos: []
          });
        }
      })

      //QUERY PARA RECEBER

      query_receber.on('value', snap => {
        let itens = snap.val();

        if (itens != null) {
          let receber = Object.keys(itens).map(i => itens[i]);

          let total_receber = [];

          total_receber = receber.map(d => (
            d.valor
          )) 

          let t_receber = total_receber.reduce((to, numero) => {
            return parseFloat(to)  + parseFloat(numero);
          }, 0)

          if (itens != null) {
            
          }

          setInterval(() => {
              this.setState({ 
                receber,
                soma_receber: t_receber,
                l_receber: false,
                msg_receber: ''
            });
          }, 1000)
        } else {
            this.setState({ 
              l_receber: false, 
              msg_receber: 'Nenhum item encontrado.',
              receber: [],
              soma_receber: []
            });
        }
      })
    }

    _handleAddDispesa(){
      const ref = query;
      const id = ref.push().key;

      const { value_gasto } = this.state;
      const { value_valor} = this.state;

      if (value_gasto === '' && value_valor === '') {
        
      } else if (value_gasto === '' || value_valor === '') {
        
      } else if (value_gasto && value_valor !== null) {

        const m = moment().format('L');

        const d = m.split('/');

        const newDate = `${d[1]}/${d[0]}/${d[2]}`

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
      }

    }

    _handleAddDivida(){
      const ref = query_receber;
      const id = ref.push().key;

      const { value_pessoa } = this.state;
      const { value_dinheiro } = this.state;

      if (value_pessoa === '' && value_dinheiro === '') {
        
      } else if (value_pessoa === '' || value_dinheiro === '') {
        
      } else if (value_pessoa && value_dinheiro !== null) {
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
        this.setState({ contas: [], msg_gastos: 'Nenhum item encontrado.'  })
      }

      query.child(key).remove()
    }

    _handleApagar(key) {

      const { pagos } = this.state;

      if (pagos.length === 1) {
        this.setState({ pagos: [], msg_pagos: 'Nenhum item encontrado.' })
      }

      const ref = query_pagos;

      ref.child(key).remove()
    }

    _handleExit = () => {
      const uid =  localStorage.getItem("u:money");
      localStorage.removeItem("u:money", uid);
      // eslint-disable-next-line no-restricted-globals
      window.location.reload();
    }

    render() {
      return (
        <div>
          <Navbar fixed className="green" alignLinks="left">
            <h5>Money: Sistema para gastos pessoais</h5>
            <NavItem
              onClick={
                () => alert(
                  "Sobre: \n"
                  +"Cadastrar despesas gerais: \n"
                  +"-Gastos \n"
                  +"-Pagar os gastos \n"
                  +"-Dividas"
                )
              }
            >
              Sobre
            </NavItem>

            <NavItem onClick={() => this._handleExit()}>
              Sair
            </NavItem>
          </Navbar>
          <div className="row">
            <br /><br />
              <div className="row">
                <div className="col s12">
                <div className="col s4">
                    <div className="card darken-1">
                      <div className="card-content white-text">
                        <span style={{ color: 'black' }} className="card-title">Gráfico</span>
                        <table>
                          <tbody>
                          <tr>
                              <td style={{ color: 'black' }}>
                                <h6>Pagas: </h6> 
                              </td>
                              <td></td>
                              <td></td>
                              <td style={{ color: 'red' }}>
                                <h6> { `R$ ${this.state.soma_pagos}` } </h6> 
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: 'black' }}>
                                <h6>Pendentes: </h6> 
                              </td>
                              <td></td>
                              <td></td>
                              <td style={{ color: 'red' }}>
                                <h6> { `R$ ${this.state.soma}` } </h6> 
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: 'black' }}>
                                <h6>Receber: </h6> 
                              </td>
                              <td></td>
                              <td></td>
                              <td style={{ color: 'red' }}>
                                <h6> { `R$ ${this.state.soma_receber}` } </h6> 
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <br />
                        <Line 
                          data = {this.state.chartData}
                          options = {{
                              display: true,
                              title: 'Tabela de gastos'
                          }}
                        />
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
                    <div id="recive">
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
            <Footer 
              style={{ backgroundColor: 'green' }}
              copyrights="2019 Copyright Todos os direitos reservados." />
        </div>
      );
    }
  }

  export default App;
