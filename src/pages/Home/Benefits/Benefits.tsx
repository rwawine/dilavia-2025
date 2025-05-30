import styles from './Benefits.module.css'

export default function Benefits() {
    return (
        <section className={styles.benefits}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.item}>
                        <h3 className={styles.title}>Быстро реализуем проекты</h3>
                        <p className={styles.description}>
                            Изготовление до 35 рабочих дней с момента запуска заказа на
                            производстве. Работаем по строгим стандартам качества на каждом
                            этапе: от выбора материалов до установки мебели
                        </p>
                    </div>

                    <div className={styles.item}>
                        <h3 className={styles.title}>
                            Даем гарантию на изделия 18 месяцев
                        </h3>
                        <p className={styles.description}>
                            Наша мебель отличается высокой прочностью и долговечностью. Мы
                            уверены в качестве своей продукции.
                        </p>
                    </div>

                    <div className={styles.item}>
                        <h3 className={styles.title}>Предлагаем лучшие материалы</h3>
                        <p className={styles.description}>
                            Для каждого проекта мы тщательно выбираем подходящий материал под
                            ваш бюджет, функциональные задачи и ваши требования к конечному
                            результату
                        </p>
                    </div>

                    <div className={styles.item}>
                        <h3 className={styles.title}>
                            Изготавливаем мебель нестандартных размеров
                        </h3>
                        <p className={styles.description}>
                            Многие магазины мебели предлагают стандартные решения, которые
                            могут не соответствовать вашим потребностям. Мы создаем
                            индивидуальную мебель с учетом вашего роста и особенностей
                            планировки
                        </p>
                    </div>

                    <div className={styles.item}>
                        <h3 className={styles.title}>
                            Работаем по договору и техническому заданию
                        </h3>
                        <p className={styles.description}>
                            Строго придерживаемся условий договора и технического задания, что
                            помогает нам организовать эффективную реализацию проекта и
                            соответствовать вашим ожиданиям
                        </p>
                    </div>

                    <div className={styles.item}>
                        <h3 className={styles.title}>
                            Приглашаем в шоурум для знакомства с образцами
                        </h3>
                        <p className={styles.description}>
                            В нашем шоуруме при демонстрации тканей мы используем реальные
                            образцы. Это позволяет увидеть цвет вживую, оценить материала и
                            почувствовать фактуру будущего изделия на вашем диване.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
