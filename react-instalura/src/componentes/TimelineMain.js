import React, { Component } from 'react';
import FotoItem from './Foto';
import Pubsub from 'pubsub-js';
import { CSSTransitionGroup } from 'react-transition-group';

export default class TimelineMain extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.props.login;
    }

    carregaFotos() {
        let urlPerfil;

        if (this.login === undefined) {
            urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
        }
        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                this.setState({ fotos: fotos });
            });
    }

    componentWillMount() {
        Pubsub.subscribe('timeline', (topico, fotos) => {
            this.setState({ fotos: fotos })
        })

        Pubsub.subscribe('atualiza-liker', (topico, infoLiker) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId)
            const possivelLiker = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);
            if (possivelLiker === undefined) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login)
                fotoAchada.likers = novosLikers;
            }
            this.setState({ fotos: this.state.fotos })
        })

        Pubsub.subscribe('atualiza-comentario', (topico, infoComentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId)
            fotoAchada.comentarios.push(infoComentario.comentario);
            this.setState({ fotos: this.state.fotos })
            
        })
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== undefined) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    like(fotoId) {
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then(resposta => {
                if (resposta.ok) {
                    return resposta.json();
                } else {
                    throw new Error('não foi possivel likear a foto')
                }
            })
            .then(liker => {

                Pubsub.publish('atualiza-liker', { fotoId, liker });
            })
            .catch(error => {
                console.log(error);
            })
    }

    comenta(fotoId, texto) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }
        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(resposta => {
                if (resposta.ok) {
                    return resposta.json();
                } else {
                    throw new Error('não foi possivel comentar')
                }
            })
            .then(comentario => {
                Pubsub.publish('atualiza-comentario', { fotoId, comentario })
            })
    }

    render() {
        return (
            <div className="fotos container">
                <CSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta} />)
                    }
                </CSSTransitionGroup>
            </div>
        );
    }
}