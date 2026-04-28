package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.dto.ServiceResponseDTO;
import com.tourbooking.tour_management.entity.Service;
import java.util.List;

public interface ServiceService {
    // Luồng tạo và quản lý
    Service createService(Service service);
    Service updateService(String providerId, String serviceId, Service details);
    void deleteService(String providerId, String serviceId);
    void restoreService(String providerId, String serviceId);

    // Tính năng đặc biệt cho Combo
    Service addExistingToCombo(String providerId, String serviceId, String parentId);

    // Luồng truy vấn
    List<Service> getAllServices();
    Service getServiceById(String id);
    List<Service> getServicesByProvider(String providerId);
    List<Service> getSubServices(String parentId);


    List<ServiceResponseDTO> getAllServicesWithRatings();
    List<Service> searchServices(String query);

    com.tourbooking.tour_management.dto.ProviderDashboardDTO getProviderDashboard(String providerId);
}
