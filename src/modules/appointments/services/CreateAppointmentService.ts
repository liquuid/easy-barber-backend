import {startOfHour} from 'date-fns';
import {injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface IRequest{
    date: Date;
    provider_id: string;
}

@injectable()
class CreateAppointmentService {
    constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository
      ){}

    public async execute({ date, provider_id}: IRequest): Promise<Appointment> {
        const parsedDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate( parsedDate);

        if(findAppointmentInSameDate){
            throw new AppError('This appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: parsedDate,
        });
        return appointment;

    }

}

export default CreateAppointmentService;
