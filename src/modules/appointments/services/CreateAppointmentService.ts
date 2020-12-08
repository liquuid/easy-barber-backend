import {startOfHour} from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface RequestDTO{
    date: Date;
    provider_id: string;
}

class CreateAppointmentService {
    public async execute({ date, provider_id}: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const parsedDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate( parsedDate);

        if(findAppointmentInSameDate){
            throw new AppError('This appointment is already booked');
        }

        const appointment = await appointmentsRepository.create({
            provider_id,
            date: parsedDate,
        });
        return appointment;

    }

}

export default CreateAppointmentService;
