import Happy_Users from './../assets/images/Happy_Users.svg'
import Created_links from '../assets/images/Created_Links.svg'
import Templates from './../assets/images/Templates.svg'
function Stats(){
    return (
<aside id="stats">
            <h2>Here you can see our stats</h2>

            <div className="stat_card">
                <div className="stat_cube">
                    <div className="stat_face stat_front">
                        <section className="stat_image">
                            <img src={Happy_Users} alt="svg de usuarios felices"/>
                        </section>
                    </div>
                    <div className="stat_face stat_back">
                        <section className="stat_number">
                            <p>numero sacado de una bbdd</p>
                            <p>Happy Users 👨👩✔</p>
                        </section>
                    </div>
                </div>
            </div>

            <div className="stat_card">
                <div className="stat_cube">
                    <div className="stat_face stat_front">
                        <section className="stat_image">
                            <img src={Created_links} alt="svg de links creados"/>
                        </section>
                    </div>
                    <div className="stat_face stat_back">
                        <section className="stat_number">
                            <p>numero sacado de una bbdd</p>
                            <p>Created Links 📱🔗✔</p>
                        </section>
                    </div>
                </div>
            </div>

            <div className="stat_card">
                <div className="stat_cube">
                    <div className="stat_face stat_front">
                        <section className="stat_image">
                            <img src={Templates} alt="svg de plantillas generadas"/>
                        </section>
                    </div>
                <div className="stat_face stat_back">
                    <section className="stat_number">
                        <p>numero sacado de una bbdd</p>
                            <p>Templates 📑📜✔</p>
                        </section>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Stats