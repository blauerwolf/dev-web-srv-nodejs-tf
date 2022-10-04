const models = require('../database/models/index')
const errors = require('../const/errors')

module.exports = {
    listar: async (req, res) => {
        try {
            const pacientes = await models.paciente.findAll()

            res.json({
                success: true,
                data: {
                    pacientes: pacientes
                }
            })
        } catch (err) {
            return next(err)
            console.log(err)
        }
    },
    listarInfo: async (req, res, next) => {
        try {
            const paciente = await models.paciente.findOne({
                where: {
                    id: req.params.idPaciente
                },
                include: [{
                    model:models.paciente_medico,
                    include: [{
                        model:models.medico
                    }]
                }]
            })

            if (!paciente) return next(errors.PacienteInexistente)

            res.json({
                success: true,
                data: {
                    paciente: paciente
                }
            })
        } catch (err) {
            return next(err)
        }
    },
    crear: async (req, res, next) => {
        try {
            const paciente = await models.paciente.create(req.body)
            const medico = await models.medico.findOne({
                where: {
                    id: req.body.medicoId
                }
            })

            if (!medico) return next(errors.MedicoInexistente)

            const relacion = await models.paciente_medico.create({
                pacienteId: paciente.id,
                medicoId: req.body.medicoId
            })

            res.status(201).json({
                success: true,
                data: {
                    id: paciente.id
                }
            })
        } catch (err) {
            return next(err)
        }
    },
    actualizar: async (req, res, next) => {
        try {
            const existe = await models.paciente.findOne({
                where: {
                    id: req.params.idPaciente
                }
            })

            if (!existe) return next(errors.PacienteInexistente)

            const paciente = await models.paciente.update({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                especialidad: req.body.especialidad,
                obra_social: req.body.obra_social,
            }, {
                where: { id: req.params.idPaciente },
                returning: true,
                plain: true,

            }).then (function(result) {
                console.log(result[1].dataValues)
            })

            res.json({
                success: true,
                data: {
                    id: req.params.idPaciente
                }
            })

        } catch (err) {
            return next(err)
        }
    },
}