import React, { Component } from "react";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import { auth } from "../../api";
import './style_login.css';

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  _handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const { user } = response;
        const { uid } = user;

        localStorage.setItem("u:money", uid);

        ToastsStore.success("Bem-vindo");

        setTimeout(() => {
          window.location.replace("/app/home");
        }, 1000);
      })
      .catch(error => {
        alert(error);
      });
  };

  _handleSignUp = () => {
    const { email, password } = this.state;
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      ToastsStore.success("Cadastradado com sucesso");
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    const { email, password } = this.state;
    return (
      <Container className="flex ai-center jc-center">
        
        <br /><br /><br /><br /><br /><br /><br />
          <div className="content-box-login">
          <Row id='div_login'>
            <Col>
            <ToastsContainer
                store={ToastsStore}
                position={ToastsContainerPosition.BOTTOM_CENTER}
              />
              <Form onSubmit={this._handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={email}
                    onChange={e => this.setState({ email: e.target.value })}
                    type="email"
                    placeholder="Email válido"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    value={password}
                    onChange={e => this.setState({ password: e.target.value })}
                    type="password"
                    placeholder="Senha válida"
                  />
                </Form.Group>
                <Button className="green" variant="primary" type="submit">
                  Entrar
                </Button>
                <br /><br />
                <Button onClick={ () => this._handleSignUp() } 
                  className="blue" variant="primary" type="button">
                  Cadastrar-se
                </Button>
                <p style={{ color: 'red' }}>
                  * Cadastro: digite email e senha e clique em "Cadastrar-se".
                  <p> * Entrar: digite email e senha e clique em "Entar". </p>
                </p>
              </Form>
            </Col>
          </Row>
        </div>
        
      </Container>
    );
  }
}

export default Login;
