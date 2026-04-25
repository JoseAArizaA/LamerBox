import React from 'react';
import { Link } from 'react-router-dom';
import './NoutFound.css';

const NotFound = () => {
    return (
        <main className="not-found" role="main" aria-labelledby="not-found-title">
            <div className="film-grain" aria-hidden="true"></div>

            <section className="not-found-card">
                <p className="error-code">404</p>
                <h1 id="not-found-title">Página no encontrada</h1>
                <p className="error-message">
                    La dirección URL no es correcta o la página ya no existe.
                </p>

                <div className="cta-row">
                    <Link className="btn-home" to="/">
                        Volver al inicio
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default NotFound;