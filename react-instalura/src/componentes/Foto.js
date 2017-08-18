import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pubsub from 'pubsub-js';

class FotoAtualizacoes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      likeada: this.props.foto.likeada
    }
  }

  like(event) {
    event.preventDefault();
    this.setState({ likeada: !this.state.likeada })
    this.props.like(this.props.foto.id);
  }

  comenta(event){
    event.preventDefault();
    this.props.comenta(this.props.foto.id, this.comentario.value);
    this.comentario.value = '';
  }

  render() {
    return (
      <section className="fotoAtualizacoes">
        <a onClick={this.like.bind(this)} className={this.state.likeada ? "fotoAtualizacoes-like-ativo" : "fotoAtualizacoes-like"}>Likar</a>
        <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
          <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={(input) => this.comentario = input}/>
          <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
        </form>
      </section>
    );
  }
}

class FotoInfo extends Component {
  render() {
    return (
      <div className="foto-in fo">
        <div className="foto-info-likes">
          {
            this.props.foto.likers.map((liker, index) => {
              if(this.props.foto.likers !== null) 
              return (
                <span key={liker.login}>                
                <Link  to={`/timeline/${liker.login}`}>{liker.login}
                  {index + 1 === this.props.foto.likers.length ? ' ' : ','}
                </Link>
                  {this.props.foto.likers.length === 1 ?'curtiu': ''}
                  {this.props.foto.likers.length > 1 && this.props.foto.likers.length === index + 1 ?'curtiram': ''}
                </span>
                );
            })

          }
          
        </div>

        <p className="foto-info-legenda">
          <Link className="foto-info-autor" to={`/timeline/${this.props.foto.loginUsuario}`}>{this.props.foto.loginUsuario} </Link>
          {this.props.foto.comentario}
        </p>

        <ul className="foto-info-comentarios">
          {
            this.props.foto.comentarios.map(comentario => {
              return (
                <li className="comentario" key={comentario.id}>
                  <Link className="foto-info-autor" to={`/timeline/${comentario.login}`}>{comentario.login} </Link>
                  {comentario.texto}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

class FotoHeader extends Component {
  render() {
    return (
      <header className="foto-header">
        <figure className="foto-usuario">
          <Link to={`/timeline/${this.props.foto.loginUsuario}`}><img src={this.props.foto.urlPerfil} alt="foto do usuario" /></Link>
          <figcaption className="foto-usuario">
            <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
              {this.props.foto.loginUsuario}
            </Link>
          </figcaption>
        </figure>
        <time className="foto-data">{this.props.foto.horario}</time>
      </header>
    );
  }
}

export default class FotoItem extends Component {
  render() {
    return (
      <div className="foto">
        <FotoHeader foto={this.props.foto} />
        <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
        <FotoInfo foto={this.props.foto} />
        <FotoAtualizacoes foto={this.props.foto} like={this.props.like} comenta={this.props.comenta}/>
      </div>
    );
  }
}